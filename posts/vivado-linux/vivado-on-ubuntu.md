---
title: Install Vivado on Ubuntu 20.04 LTS
---

Recently, I got confirm from Xilinx FAE that Vitis (including Vivado) works better on Linux machine. Some part of Vitis, such as compiler of AI Engine, even only supports Linux. They internally work on RedHat (RHEL), but Ubuntu should be more convenient for a personal developer. Here I wrote a general guide for installing and using Vivado on Ubuntu.

## Install Vivado

*Ubuntu 20.04.1 LTS* is latest supported version list in [UG973 Vivado Design Suite user Guide: Release Notes, Installation, and Licensing][UG973]. However, often additional library are required before running the installer. The needed library depends on one the Linux distribution. For Ubuntu 20.04 LTS, only one library `libtinifo5` is missing. Install it using:

```bash
sudo apt install libtinifo5
```

Then download installer and run `xsetup`. Without this library, installer will suck at "generating device list" and never finish.

Xilinx does not allow you to run the installer with root privilege. If you want to install Vivado to **/opt** directory (a proper place to share installed software with other users), you need to create a folder using `sudo`. Then change the folder's mode to give your current user write permission.

### Install VIVADO in Batch Mode

I used to face Vivado/Vitis 2020.1 GUI installer's bug. It does not work under Ubuntu 18.04.5 (it works under Ubuntu 18.04.4). To bypass the issue, I have to install it in batch mode. The installer provide a CLI interface:

```bash
./xsetup -h
```

This will see all parameters of the installer.

1. Generate the install configuration file:

    ```bash
    ./xsetup -b ConfigGen
    ```

    This will generate a "install configuration file" **~/.Xilinx/install_config.txt**. Edit it with text editor, select features, install folder, etc.

2. Install Vivado/Vitis:

    ```bash
    ./xsetup -a XilinxEULA,3rdPartyEULA,WebTalkTerms -b install -c ~/.Xilinx/install_config.txt
    ```

    It takes a while.

### Uninstall

After installation, the uninstaller will appear on **\<vivado_install\>/.xinstall/xsetup**. You can uninstall Vivado/Vitis using:

```bash
./xsetup -b uninstall
```

Or run the uninstall desktop entry file.

## Install Cable Driver

Cable driver is required if you need debug hardware using Xilinx *Platform Cable USB II*. Seems this driver also support [Digilent](https://store.digilentinc.com)'s [JTAG-HSx](https://store.digilentinc.com/jtag-hs3-programming-cable/) and [JTAG-SMTx](https://store.digilentinc.com/jtag-smt4-surface-mount-programming-module/). If you have Vivado full or lab version installed, the driver installer lies on:

**\<install_folder\>/Vivado/2021.1/data/xicom/cable_drivers/lin64/install_script/install_drivers/install_drivers**.

Run it with `sudo`:

```bash
sudo ./install_drivers
```

## Desktop Entry

On Linux, Xilinx installer will only create desktop entry (**.desktop* files) for current user. This cause some inconvenient for sharing the installation with others. Those desktop entry lies under **~/Desktop** and **~/.local/share/applications**. You can copy some of them from *~/.local/share/applications** to **/usr/share/applications**. So other user can start Vivado from gnome launcher.

[UG973]: https://www.xilinx.com/support/documentation/sw_manuals/xilinx2021_1/ug973-vivado-release-notes-install-license.pdf
