<div align="center">

<h1 align="center">Next Online Judge</h1>



[English](./README.md) / [简体中文](./README_CN.md)

[Issues](https://github.com/AprilNEA/Next-Online-Judge/issues) / [Telegram](https://t.me/NextOJudge)

</div>

## Install
### Dependencies
1. Install [nsjail](https://nsjail.dev)
   Download source code

```shell
git clone https://github.com/google/nsjail.git
cd nsjail
```

Install the necessary dependencies

```shell
sudo apt-get update
sudo apt-get install -y autoconf bison flex g++ git libprotobuf-dev libtool make pkg-config protobuf-compiler python3-minimal
# openssl
sudo apt-get install libnl-3-dev libnl-route-3-dev
```

Build

```shell
make # make -j8
```

### Run
Clone
```shell
git clone https://github
```