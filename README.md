# Shopper Backend

## 📝 Environment Setup

Before building the Docker image, make sure to create a `.env` file based on the `.env.example` file provided in the repository. This example file contains all the necessary environment variables required to run the application. Simply copy `.env.example` to `.env` and fill in the appropriate values.

## 👨🏻‍🔧 Installation

Make sure the `.env` file is correctly set up, and then build a Docker image using the following command:

```
docker compose build
```

Once the image is built, start the container:

```
docker compose up -d
```

That's all you need 🎉!

## TESTS

You can run the tests with the following command:

```
npm run tests
```
