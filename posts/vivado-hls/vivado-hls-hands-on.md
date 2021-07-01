---
title: Vivado HLS 简单上手
---

Vivado HLS 是 Xilinx 的 Vivado 设计套件中的一个组件，它可以将 C/C++/System C 代码编译到 FPGA 设计中常用的 Verilog，VHDL 代码。这些代码可以进一步在 Vivado 中进行综合，最终产生可用的 FPGA 网表。

<!--more-->

## 优势

其实不管是 FPGA 还是别的技术，都只是实现你的“计算”的手段。这个计算可能是数字信号处理、逻辑控制、图像压缩等等。FPGA 在诸多常用的手段中是有它的独到特色和优势的，具体也不再废话。但是劣势也很明显，这是摘自 Xilinx [UG998 - Introduction to FPGA Design with Vivado High-Level Synthesis](http://www.xilinx.com/support/documentation/sw_manuals/ug998-vivado-intro-fpga-design-hls.pdf) 一文中的一张图：

![fpga-rtl-dev.png](/image/hls-fpga-rtl-dev.png)

实际写过 FPGA 大概就明白，这张图是比较中肯的，很多高速运算是需要依靠 FPGA 的（比如比特币矿机）。但是 FPGA 最常用的设计语言，Verilog 和 VHDL，就像上古时代的汇编一样。高效，控制力强，但是超麻烦。

一次，我需要在 FPGA 内写一个 2D 线性插值的模块，算法很简单：

$$ y = c_0 + (c_1-c_0)\frac{x_1}{S} + (c_2-c_0)\frac{x_2}{S} + (c_3-c_2-c_1+c_0)\frac{x_1 x_2}{S^2} $$

其中 $c_i,x_j$ 都是输入，$S$ 是常数。计算上面的公式需要若干加法器和乘法器（除法用位移来代替）。按照常规的思路，我开始规划先算哪几个加法或是乘法，然后算哪几个运算。其中需要注意加法器和乘法器的延迟来对其数据，同时还要考虑每个中间步骤的位宽，注释其意义。折腾了相当久，最后发现这模块我居然写出来了上百行。

第二天再看自己的代码，被恶心到的同时，我决定尝试下 HLS。上手花了一些时间，但总体效果还是可以。上述 2D 插值模块的 C 代码不过几行，编译不过几秒。如果以后需要修改位宽什么的，也仅需简单修改几个定义:

```c
// file: interp2d.c
#include <ap_cint.h>

void interp2d (int12 c0, int12 c1, int12 c2, int12 c3, uint6 x1, uint6 x2, int12 * y)
{
    *y = c0 +
        (((c1 - c0) * x1) >> 6) +
        (((c2 - c0) * x2) >> 6) +
        (((c3 - c2 - c1 + c0) * x1 * x2) >> 12);
}
```

最后 Vivado HLS 会给你 Verilog，VHDL 和 System C 代码，它们可以直接拷贝出去用（尽管没有什么可读性），或者帮你包装成 Xilinx 格式的 IP。

## 基本概念

C/C++ 代码到 RTL 的基本映射关系大概是：

```plain
Functions     -> Modules
Ariguments    -> Input/ouput ports
Operators     -> Functional units
Scalars       -> Wries or registers
Arrays        -> Memories
Control flows -> Control logics
```

最重要的是第一条，一个 C/C++ 函数对应一个 RTL 模块。HLS 会让你设置一个 **Top Function**，其实就是 RTL 设计中的 **Top Module**。函数对应的参数就是模块输入输出接口。

你在函数内用 C/C++ 在算法层次描述你想要做什么，HLS 拿到你的代码考虑怎么用 FPGA 内的常用资源来实现它。这样在某种程度上你丢失了一些控制力，但是如果编译器足够聪明，从代码到成果的转换效率会提高不少。

事实上，HLS 这个编译器还并不那么聪明。比如它只能做单一时钟的设计；只支持 C/C++ 语法中的一个很小的子集。很多时候，一个模块不只是 C/C++ 代码，还需要用户写不少 **directive** 来指导编译器。

更多的一些基本概念可以看看[这个文档](http://www.ese.wustl.edu/~xuan.zhang/ese566_files/tutorials/vivado_tutorial.pdf)和上面提到的 Xilinx 的 UG998。而下一步，自然是先去磕 Xilinx 官方的教程。

## 缺点

Vivado HLS 并不能完全的替代 Vivado，因为它的定位仅仅是模块/IP的设计。另外也并不是所有的模块 HLS 都能够（方便的）设计出来。一般来说，FPGA 内会进行两种工作：其一是数值计算，其二是逻辑控制。HLS 更擅长进行数值计算类模块的设计，而要设计逻辑控制类的模块，比如 UART 收发器，就有些不知如何是好了。

另外，HLS 生成的 IP，并不能像很多 Xilinx 提供的或者 HDL 编写的 IP 那样可以通过设置 **Parameters** 来作通用化。修改参数（比如位宽）只能从源代码级修改再生成。

最后 HLS 的模块接口设计并不是那么得心应手，控制信号和时序有些时候显得有点奇怪。还需要打开 Vivado 进行 RTL 仿真来看看怎么用。
