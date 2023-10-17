<div align="center">

<h1 align="center">Next Online Judge</h1>



[English](./README.md) / [简体中文](./README_CN.md)

[Issues](https://github.com/AprilNEA/Next-Online-Judge/issues) / [Telegram](https://t.me/NextOJudge)

</div>

## Install

### Dependencies

Install [nsjail](https://nsjail.dev) for the sandbox environment.

1. Install the necessary dependencies
    ```shell
    sudo apt-get update
    sudo apt-get install -y autoconf bison flex gcc g++ git libprotobuf-dev libnl-route-3-dev libtool make pkg-config protobuf-compiler
    ```
2. Clone and build
    ```shell
    git clone https://github.com/google/nsjail.git
    & cd nsjail
    & make # make -j8
    ```

### Set up the database with other environments variables

> [!IMPORTANT]
> Environment need: Node.js >= 18, Postgres >= 15

1. Set environment variables into `.env` under the root directory

   | KEY          | VALUE                          |
      |--------------|--------------------------------|
   | DATABASE_URL | The database connection string |
   | REDIS_URL    | The redis connection string    |
   | SECRET_TOKEN | The key for session management |

   You can use `openssl rand -hex 32` to generate a random string for `SECRET_TOKEN`.
   Then run `cp .env packages/backend/.env` to copy the `.env` file to the backend directory.

2. Init the database schema
    ```shell
    git clone https://github.com/AprilNEA/next-online-judge.git
    & cd next-online-judge
    & npm install -g prisma # pnpm or yarn, -g(--global) is optional
    & prisma db push
    ```
3. Run the backend server
    ```shell
    cd packages/backend
    & cargo build --release
    & cargo run --release
    ```

### Run

## Contribute

If you want to run the project locally, you can follow the steps above too.
