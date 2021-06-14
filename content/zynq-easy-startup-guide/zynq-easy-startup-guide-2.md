---
title: "ZYNQ Easy Startup Guide, Part II"
date: 2020-02-27T14:46:52+08:00
categories: [FPGA]
tags: [ZYNQ, Linux, PetaLinux]
---

In previous part I of ZYNQ Easy Startup Guide, I introduced how we start a bare metal PS program on ZYNQ7 board. In the second part of this serious, we will try to build and start Linux on ZYNQ, using Xilinx's PetaLinux tool.

<!--more-->

## Required Things

In general, Linux kernel is a "bare metal" program that runs on ZYNQ's Cortex-A7 processer. We are using the Vitis IDE to build normal bare metal program, but Linux and some components use it self's make file. So actuary we does not need Vitis IDE. In a hard way, we only need cross compile toolchain and source file. It's really really hard, so Xilinx provide a all in one tool called PetaLinux.

### Software Tools

* [**PetaLinux**](https://www.xilinx.com/products/design-tools/embedded-software/petalinux-sdk.html) is a software tool by Xilinx to help to customize, build and deploy Embedded Linux to Xilinx chips (Zynq and ZynqMP). To run Linux on Zynq, we need many components including u-boot and Linux kernel. Actually we can build all of them using a toolchain and source. So It's not a must tool if you want Linux on Zynq. But it can help a lot. PetaLinux can only be installed and used on Linux OS.

* (Optional) **Vivado (suit)** and **Vitis IDE**. It's not necessary we have them installed, if we already got the *.xsa* file generated from PL top design.

### Install PetaLinux

Install PetaLinux is not quite straight forward. So it's covered in this post.

1. Download the PetaLinux installer (**.run** file) from [Xilinx Website](https://www.xilinx.com/support/download/index.html/content/xilinx/en/downloadNav/embedded-design-tools.html). Choose latest installer (2019.2 when I'm writing this post, 7+ GB).

2. Prepare the install environment:

   * OS: I'm using **Ubuntu 18.04.x LTS**. Other supported OS can be found on release note.

   * Install required packages in [PetaLinux Release Note](https://www.xilinx.com/support/answers/72950.html). You can find a excel file [2019.2_PetaLinux_Packages_List](https://www.xilinx.com/Attachment/2019.2_PetaLinux_Package_List.xlsx) tells you which package is required for Ubuntu:

     ```bash
     sudo apt-get install gawk python build-essential gcc git make net-tools libncurses5-dev tftpd zlib1g-dev libssl-dev flex bison libselinux1 gnupg wget diffstat chrpath socat xterm autoconf libtool tar unzip texinfo zlib1g-dev gcc-multilib zlib1g:i386 screen pax gzip
     ```
     
     > Xilinx says one package called **build-essential-dev** is required. But there is no package named this.
   
3. Install PetaLinux using installer:
   * Manual create folder **~/Tools/Xilinx/PetaLinux/2019.2**.
   * Make the installer executable:
     ```bash
     chmod +x petalinux-v2019.2-final-installer.run
     ```
   * Execute the **.run** installer and follow the installer:
     ```bash
     ./petalinux-v2019.2-final-installer.run ~/Tools/Xilinx/PetaLinux/2019.2
     ```
   
4. After install configuration:

    * Let `/bin/sh` be bash: `sudo dpkg-reconfigure dash`. Then answer NO.
    * Configure tftp server (Optional, I ignored it).
    
5. (Optional) Download the **sstate-cache** (8+ GB for arm/zynq) and **downloads** (22+ GB) file if you want a completely off-line workspace. See **README** on download page to see how to use it.

6. (Optional) Download the BSP files if you have OEM board.

7. (Optional) Download the "Open Components Source Code" to review the 1000+ software used by PetaLinux. It's not necessary for using PetaLinux.

### Install Xilinx Cable Driver

1. Install Vivado, or Vivado Lab Edition (much smaller).
2. Run driver install script located at: **\<vivado-install-dir\>/data/xicom/cable_drivers/lin64/install_script/install_drivers/**. The script's name is **install_drivers**.

### Development Board

Still we will use PYNQ-Z2 board.

## Step 1. Create PetaLinux Project

Ensure you are using `bash` shell. Source PetaLinux's setup script by:

```bash
source <path-to-petalinux-installed-folder>/settings.sh
```

The script will setup environment variable and path, then you can run `petalinx-*` executable tools from terminal. On workspace folder, create a PetaLinux project using:

```bash
petalinux-create -t project -n <name-of-project> --template zynq
```

`cd` into the project folder, and look around. There are few files.

## Step 2. Import Hardware Description

Like bare metal program, PetaLinux need the hardware definition file *.xsa* to get the information about PL design and process initial configuration.

```bash
petalinux-config --get-hw-description=<path-to-hdf-folder>
```

Note that the path is not to *.xsa* file, but to the folder contains it (very strange). The tool will try to import the .xsa file found on that folder and generate some configuration files. After you type the command, an menu will appear in terminal (same configurate menu as you type `petalinux-config`). This is configuration wizard for PetaLinux project, or Xilinx call it system configuration. You can look around but close it with all default value.

> Note: Xilinx's UG1144 says you should set **DTG Settings ---> MACHINE_NAME (CONFIG_SUBSYSTEM_MACHINE_NAME)** to some OEM board's name like zc702. But for custom board, leave the default value **template**. Or the tool will load some different device tree for your board and lead to some strange error.

After you close the menu, tool will start to build some library and tools for ZYNQ. Mainly the toolchain, I think. This takes a long time. After the tools finished processing, the folder will become very large :)

## Step 3. Build Project

Components we need to boot and to build including:

* FSBL: First stage bootloader.
* U-Boot (as SSBL): An very common second stage bootloader for Linux.
* Linux Kernel: The real program that runs on CPU.
* Device Tree Blob: Stores the device information for Linux kernel.
* rootfs: Root file system. Provides you the files/programs/tools can be used in Linux.

Other things included in the boot image is bitstream file for FPGA. All these things can be build together by using:

```
petalinux-build
```

It takes time when PetaLinux download source from internet and build them. After finish, all build result will be placed in *\<petalinux-project-dir\>/images/linux*.

## Step 4. Package the Boot Image

Next step is package the boot components into "boot image". In fact there are many ways to package the components. For SD boot, I recommend package FSBL, FPGA Bitstream and U-Boot into boot image.

```
petalinux-package --boot --fsbl --fpga --u-boot
```

The packaged boot image is called **BOOT.BIN** and placed in *\<petalinux-project-dir\>/images/linux* folder.

Copy **BOOT.BIN** and **image.ub** to SD card. Plug the card into board. Change the boot mode to SD, then power up board. Plug the UART cable and see the print information using a serial terminal tool (e.g. tera term).

## What Happened

We just finished a simple PetaLinux workflow to build an bootable Linux image for ZYNQ. Even almost all the build steps are done by tools and we know less about the detail, the build result is a good start point for us to play.

## What's Next

Next step we will try to build each components all by our hand, and learn how to modify them.

## Reference

[UG1144 - PetaLinux Tools Documentation: Reference Guide](https://www.xilinx.com/support/documentation/sw_manuals/xilinx2019_2/ug1144-petalinux-tools-reference-guide.pdf)

[UG1157 - PetaLinux Tools Documentation: Command Line Reference Guide](https://www.xilinx.com/support/documentation/sw_manuals/xilinx2019_2/ug1157-petalinux-tools-command-line-guide.pdf)