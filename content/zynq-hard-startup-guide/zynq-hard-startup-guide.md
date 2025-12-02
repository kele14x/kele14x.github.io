---
title: "ZYNQ Hard Startup Guide"
date: 2020-02-29T14:46:52+08:00
categories: [FPGA]
tags: [ZYNQ, Linux, PetaLinux]
---

There are different ways to get your Zynq running.  Here is the components we need for a Zynq Linux system:

* *.hdf* or *.xsa* file, it includs FPGA design, Zynq chip configuration and peripherals information
* Cross-Compile Toolchain, also the C/C++ library associate with it. There are [many to choose from](https://elinux.org/Toolchains):
    * For PetaLinux/Yocto, it use generated toolchain when running build
    * The toolchain ships with Vitis/Vivado installation
    * [Bootlin](https://bootlin.com/)
    * [Buildroot](https://buildroot.org) generated
    * Linaro (ARM)
    * CodeSourcery
    * ...
* FSBL, first stage boot loader
    * Usually build from Xilinx's FSBL source. Vitis provides project draft for it
* SSBL, second stage boot loader
    * Usually U-Boot. Xilinx provides modified [u-boot-xlnx](https://github.com/Xilinx/u-boot-xlnx)
* Linux Kernel
    * Xilinx provides modified [linux-xlnx](https://github.com/Xilinx/linux-xlnx)
* Device tree
    *  Xilinx provides a device tree generator [device-tree-xlnx](https://github.com/Xilinx/device-tree-xlnx). The device tree source is generated from *.hdf, .xsa* file
* RootFS, root file system
    * PetaLinux generated
    * Buildroot generated
    * OpenWRT
    * Linux Distributions, such Ubuntu/Debian

It's hard to get everything a try and make it work, so usually you only select one of each components.

