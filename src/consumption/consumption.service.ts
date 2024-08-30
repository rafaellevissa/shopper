import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";
import { application, aws } from "../common/config/constants";
import { Between, Repository } from "typeorm";
import ConsumptionEntity from "./consumption.entity";
import database from "../common/config/database";
import {
  ConsumptionList,
  ConsumptionUploaded,
  HTTPErrorCode,
  HTTPStatusCode,
  MeasureType,
} from "../common/data-types";
import { S3Storage } from "../common/utils/storage";
import { HttpException } from "../common/exception";

export default class ConsumptionService {
  private geminiModel: GenerativeModel;

  private consumptionRepository: Repository<ConsumptionEntity>;

  private storage: S3Storage;

  constructor() {
    const gemini = new GoogleGenerativeAI(application.geminiToken);

    this.geminiModel = gemini.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    this.consumptionRepository =
      database.manager.getRepository(ConsumptionEntity);
    this.storage = new S3Storage({
      bucketName: aws.s3.bucketName,
      region: aws.region,
    });
  }

  public async listByCustomer(
    customerCode: string,
    measureType?: MeasureType
  ): Promise<ConsumptionList> {
    const consumptions = await this.consumptionRepository.findBy({
      customer_code: customerCode,
      measure_type: measureType,
    });

    if (!consumptions.length) {
      throw new HttpException(
        HTTPStatusCode.NOT_FOUND,
        HTTPErrorCode.MEASURES_NOT_FOUND,
        "Nenhuma leitura encontrada"
      );
    }

    return {
      customer_code: customerCode,
      measures: consumptions,
    };
  }
  public async confirm(
    measure_uuid: string,
    confirmed_value: number
  ): Promise<void> {
    const measure = await this.consumptionRepository.findOne({
      where: {
        id: measure_uuid,
      },
    });

    if (!measure) {
      throw new HttpException(
        HTTPStatusCode.NOT_FOUND,
        HTTPErrorCode.MEASURE_NOT_FOUND,
        "Leitura do mês já realizada"
      );
    }

    if (measure.confirmed_at) {
      throw new HttpException(
        HTTPStatusCode.CONFLICT,
        HTTPErrorCode.CONFIRMATION_DUPLICATE,
        "Leitura do mês já realizada"
      );
    }

    await this.consumptionRepository.update(
      {
        id: measure_uuid,
      },
      {
        measure_value: confirmed_value,
        confirmed_at: new Date(),
      }
    );
  }

  public async findConsumptionByMonth(
    measure_datetime: Date
  ): Promise<ConsumptionEntity | null> {
    const startOfMonth = new Date(
      measure_datetime.getFullYear(),
      measure_datetime.getMonth(),
      1
    );
    const endOfMonth = new Date(
      measure_datetime.getFullYear(),
      measure_datetime.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    return this.consumptionRepository.findOne({
      where: {
        measure_datetime: Between(startOfMonth, endOfMonth),
      },
    });
  }

  public async save(
    base64Image: string,
    measureDatetime: Date,
    measureType: MeasureType,
    customerCode: string
  ): Promise<ConsumptionUploaded> {
    const consumption = await this.findConsumptionByMonth(measureDatetime);

    if (consumption) {
      throw new HttpException(
        HTTPStatusCode.CONFLICT,
        HTTPErrorCode.DOUBLE_REPORT,
        "Já  existe  uma  leitura  para  este  tipo no mês atual"
      );
    }

    const measureValue = await this.detectConsumption(base64Image);
    const s3Key = `consumption/pictures/${Date.now()}.jpeg`;

    await this.storage.upload(Buffer.from(base64Image, "base64"), s3Key);

    const temporaryLink = await this.storage.getObjectTemporaryLink(s3Key);

    const newConsumption = this.consumptionRepository.create({
      measure_datetime: measureDatetime,
      customer_code: customerCode,
      measure_type: measureType,
      measure_value: measureValue,
      attachment: s3Key,
    });

    const savedConsumption = await newConsumption.save();

    return {
      image_url: temporaryLink,
      measure_uuid: savedConsumption.id,
      measure_value: measureValue,
    };
  }

  public async detectConsumption(base64Image: string): Promise<number> {
    const uploadResponse = await this.geminiModel.generateContent([
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Image,
        },
      },
      {
        text: "Leia o consumo de água e gás nesta imagem do medidor e retorne apenas o valor numérico.",
      },
    ]);

    const measureValue = parseInt(uploadResponse.response.text());

    if (isNaN(measureValue)) {
      throw new Error(
        "The LLM could not detect the measure valeu from the image"
      );
    }

    return measureValue;
  }
}
