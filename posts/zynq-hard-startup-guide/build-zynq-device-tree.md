---
title: "Build ZYNQ Device Tree"
date: 2020-03-24T14:46:52+08:00
categories: [FPGA]
tags: [ZYNQ, Linux, Vitis]
---

Let's try build a boot image for ZYNQ, in a hard way. Part II will cover device tree.

Device Tree is key component for running Linux. It's often be called DTS (Device Tree Structure) or DTB (Device Tree Blob), different depend on whether it is source or compiled binary. We will try to build DTB from source.

<!-- more -->

In fact, both u-boot and Linux need a DTS/DTB, we will talk it later. For most ARM board, the DTS is fixed, thus we can just grab one from vender and does not need to "build" it. But it's not true for Zynq, since the PL side is not fixed. Many IPs are provided as a peripheral and Linux should load drivers for them.

## 0. Prerequisites

* Install Xilinx Vitis tool.

* Build the hardware (PL/FPGA side) design, and export **.xsa** file.

## 1. Install Xilinx Device Tree Generator

In Vivado, we build the PL side design and export the hardware handoff file (**.xsa**). The FPGA design flow ends here. Then we need to generate device tree source file from **.xsa** file. To do this, Xilinx provide a tool called [Device Tree Generator (DTG)](https://github.com/Xilinx/device-tree-xlnx) on Github. Using your git tool to clone it and checkout latest release or download the zip file from release page.

```bash
git clone git@github.com:Xilinx/device-tree-xlnx.git
git checkout xilinx-v2019.2 -b my-xilinx-v2019.2
```

If you download the zip file, unzip to some folder and keep it. The next step is launch Vitis and setup repository, since the generator need to work with Vitis.

1. Launch Vitis, on menu bar, find **Xilinx -> Repositories**. The Xilinx preferences window opened.
2. In **Local Repositories** or **Global Repositories**, click **New...** to add a new repository. In the popup window, select *device-tree-xlnx* folder.
3. Maybe Vitis need to be restarted to reload repository.

![](/image/vitis-setup-repo.png)

## 2. Create Vitis Project

1. Launch Vitis, create a new **Platform Project**. This opens new project wizard.

2. In the wizard, select the **.xsa** file exported from Vivado.

3. In the Operation system selection, choose *device_tree* (Only after you setup the repository, it will appear here).

  ![](/image/vitis-device-tree-prj.png)

4. Build the project.

5. Find your device tree under **/ps7_cortexa9_0/deivce_tree_domain/bsp** foler.

  ![](/image/vitis-device-tree-prj-output.png)

Beware that there are two top level **.dts** file here. We will use **system-top.dts**. **zynq-7000.dtsi** is included.

Another way to generate dts without create a Vitis project is using Vitis **Xilinx -> Generate Device Tree** button.

## 3. Build Device Tree Compiler (DTC)

Device tree compiler (DTC) is a tool to compile **.dts** file to **.dtb**. Ubuntu has already provide the binary package of dtc, can be installed by:

```bash
sudo apt install detive-tree-compiler
```

Or you can build new version form [dtc source at kernel.org](https://git.kernel.org/pub/scm/utils/dtc/dtc.git). It's very simple, just need to install `build-essential` and some packages (I don't know, follow error message to see which package is needed), and type `make` in dtc source folder.

> Building dtc is not cross-compile, so you does not need setup ARCH and CROSS_COMPILE environment variable.

If build from source, make sure add dtc to *PATH*.

## 4. Build Device Tree Blob

The generated **.dts** file using the c like **#include** lines to include extra **.dtsi** files. This need precompiled or preprocess before use:

```bash
gcc -E -nostdinc -undef -D__DTS__ -x assembler-with-cpp -o system-top.dts.tmp system-top.dts
```

This will generate *system-top.dts.tmp* with correct syntax for dtc. Or you can replace all **#include** with dts style **/include/** so you can skip preprocess step.

Then we can build the **.dtb** file.

```bash
dtc -I dts -O dtb -o system-top.dtb system-top.dts.tmp
```

## Reference

https://xilinx-wiki.atlassian.net/

