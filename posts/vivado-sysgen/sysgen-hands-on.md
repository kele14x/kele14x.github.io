---
title: System Generator 上手
date: 2017-07-06
---

[System Generator][SysGen PG] 是 Xilinx Vivado 套件里的组件之一。它主要的作用是利用 Matlab 中的 Simulink 组件来完成 FPGA 设计，即将 Simulink 仿真模型 **.slx** 转换为 HDL 文件。具体来说，System Generator 为 Simulink 提供了一套 Block 库，这套 Block 库既可以完成功能仿真，也有对应的 HDL 描述/网表。这和 Matlab 自己的 [HDL Coder][HDL Coder] 类似，但由于是 Xilinx 为自己的 FPGA 写的 Block 库，能够比 HDL Coder 接触到更底层的设计，以便进行优化。更多关于两个工具的对比，可以参考 Matlab 的[这个文档][Mathworks WP]。

当然也是由于工作的原因，我开始接触这个工具，让我们先简单的看看它是否好用。

<!--more-->

## 何时我们需要 System Generator

System Generator (SysGen) 这个工具设计的初衷，自然是为了在一定程度上保证设计质量的前提下缩短完成 FPGA 设计的时间。传统的 FPGA 设计采用手写 HDL 来完成，但随着 FPGA 芯片规模的慢慢增大，设计也慢慢变得非常复杂。HDL 这样“汇编”级别的设计语言渐渐显得过于繁琐和效率低下。比如说 HDL 语言中没有定点运算（Fixed Point）库，导致进行运算时常需要注释每个数的类型（例如 `Fix_xx_xx`）,并且在类型转换时要小心的手动截位。

抽象层底低让 HDL 设计出来的电路有无以伦比的效率（好的设计），但复杂度和消耗的时间随规模呈指数增长。缩短设计周期首要自然是重用和延续稳定的设计（基于 IP），其次的方法就是利用工具进行自动 HDL 代码生成，即所谓的高层次综合。这种工具其实[很多][HLS on Wikipedia]，但大部分都是面向企业用户，有很高的收费墙。SysGen 在其中算是比较容易接近到的了，毕竟 Matlab/Simulink 和 Vivado 套件都有试用版。

SysGen 的基本需求：

- Matlab
- Simulink (Matlab 的组件)
- Vivado System Edition

Matlab 和 Vivado
具体版本的搭配有一些需求，这得参考官方文档。另外 Matlab 的一些常用工具箱，例如 DSP、Fixed-Point 等是否是必需我不大确定，当然是有则好。

如果你对 Vivado 套件熟悉的话，Xilinx 其实还有另外一个 HDL 生成工具叫 HLS：

![Vivado 套件](/image/sysgen-vivado-ds.png)

HLS 的主要作用是将 C/C++ （*.h, *.c, *.cpp）转换成 HDL。选择 C/C++ 自然是由于 C 语言的流行（很多人都会，很多算法都有相应的 C 实现）。但本质来说，C 这种行为描述语言和 HDL 这种结构描述语言还是有不小的差距。实际使用的时候，会发现尽管 HLS 已经足够聪明，但总有一些地方用户不得不通过调整语句（换个等效的说法）或者借助 directive 来进行修正。软件工程师写出来的 C 代码，几乎不可能不经修改就进行 HLS 综合。

而 SysGen 却与 HLS 不同，基于 Block 和输入输出的 Simulink 模型本身就和 FPGA 的结构相似。甚至可以说就是 RTL 的抽象描述——Simulink 里的一个 Block 可以自然的映射为 FPGA 中的一个模块；Simulink 模型中的时间轴就是 FPGA 中的时钟。

但这也不代表 SysGen 可以完成一个完整的 FPGA 设计。现代的 FPGA 芯片内资源非常复杂，使用场景也不尽相同，SysGen 则专门为数字信号处理（DSP）设计。更简单来说，SysGen 只能使用 Xilinx FPGA 中的 CLB、Memory、DSP48 这三种资源。正因为此，SysGen 生成的 HDL/网表一般作为模块被顶层 HDL 调用。SysGen 在整个 FPGA 工程中的地位，[UG897][SysGen UG] 有更详细的解释，但可以简答的认为 SysGen 可以用来快速完成一个 DSP 模块。

## 简单上手

### 安装

SysGen 的安装比较简单：安装 Matlab，安装 Vivado System Edition，以管理员身份运行 **System Generator 201x.x MATLAB Configurator**，选择 Matlab 版本即可。然后从开始菜单运行 **System Generator 201x.x** 就会打开配置好关联的 Matlab。Matlab Console 会提示你 SysGen 已经内嵌：

![Matlab Console](/image/sysgen-matlab-console.png)

然后打开 Simulink 里的 Simulink Library Browser 就能看到 SysGen 的 Block 库了：

![Simulink Library Browser](/image/sysgen-simulink-library-browser.png)

### 简单的工程

首先需要说明的是，Xilinx Blockset 中有三个“特别”的 Block： **System Generator**、**Gateway In**、**Gateway Out**。在简单的情况下，一个 Simulink 模型（即一个 *.slx 文件）生成一个 FPGA 模块，这个 Simulink 模型中至少包含一个 **System Generator**，一个 **Gateway In**，一个 **Gateway Out**。

![Must Block](/image/sysgen-must-block.png)

**System Generator** 用于配置工程的参数，并且提供 Sysgen 操作接口：

![Sysgen Generator](/image/sysgen-block.png)

**Gateway In** 代表 FPGA 模块的输入，**Gateway Out** 代表 FPGA 模块的输出。**Gateway In** 和 **Gateway Out** 之间的路径只能包含 Xilinx Blockset 中的模块，因为它们将会被用于生成 HDL。

以 Xilinx 的 [SysGen 教程配套工程][SysGen Tutorial Files]中的 **Lab1_2** 为例，这可以说是一个典型的 SysGen 工程：

![HDL Code Gen](/image/sysgen-hdl-gen.png)

图中 **Gateway In** 和 **Gateway Out** 之间是 FPGA 模块的设计——只有一个 FIR 滤波器。左侧是测试用的激励，右侧是示波器，用于观察测试输出。下方则是用纯 Siumlink 模块搭建的同样的滤波器，用于对比输出的误差。

在生成代码之前，首先要通过仿真来确认设计是正确的。点击 Siumlink 的开始按钮，Simulink 就会调用 _vivado.exe_ 完成 Simulink 和 Vivado 的协同仿真。之后通过频谱仪就能观察到输出信号的特征。

![仿真结果](/image/sysgen-sim-result.png)

左侧为纯 Simulink 模块的输出信号的频谱，右侧为 SysGen 模块输出信号的频谱。对比可以看到量化和采样对信号带来的失真。确认设计无误后，双击打开 **System Generator** 模块，点击 **Generate**，稍等之后就能得到生成的 HDL：

```vhdl
-- Generated from Simulink block
library IEEE;
use IEEE.std_logic_1164.all;
library xil_defaultlib;
use xil_defaultlib.conv_pkg.all;
entity lab1_2 is
  port (
    gateway_in : in std_logic_vector( 16-1 downto 0 );
    clk : in std_logic;
    gateway_out : out std_logic_vector( 36-1 downto 0 )
  );
end lab1_2;
```

可以看到 SysGen 中隐含了 `clk` 端口，用于提供模块的时钟输入。如果是多速率的设计，SysGen 中还会隐含 `ce` 即时钟使能端口。至此已经完整了一个简单模块的设计流程。

### 时钟约束

FPGA 中最重要的一个约束就是时钟速率，它被用于静态时序检查。与 HLS 类似，SysGen 中可以通过设置约束时钟速度，在代码生成之后还可以自动进行综合和实现，以便检查时序和资源情况。值得称道的是，SysGen 可以将时序路径和资源消耗对应到 Simulink 模型，也就是可以通过综合和实现之后的结果来指出是哪个连线或哪个模块造成了这条路径和这些资源消耗。

![SysGen 约束](/image/sysgen-block2.png)

## System Generator 生成的代码的质量？

我们在使用 SysGen 这种工具的时候，我们可能会关心这个工具生成 HDL 代码的“质量”如何，实现的是否“优雅”。质量一般包含两个部分，其一是这个 HDL 代码可以跑多快，其二是这个 HDL 代码资源/功耗如何。在接触 SysGen 之前，我曾经觉得用工具生成的代码应该没有手写的 HDL 精简、高效（即优雅）。因为在将一个高度抽象的东西实现的过程中，机器经常会用很多机械式的、可笑的方法来完成。但用过了 HLS 和 SysGen 之后，我发现 Xilinx 的工程师在大部分的时候，还是会比我聪明；而在小部分的时候，我也可以亲手来告诉工具细节怎么处理。

让我们来看看 SysGen 的模块——SysGen 一共提供了 80 多个 Block，基本模块包括加法器、乘法器、延迟、逻辑运算等；高级的模块包括 FIR 数字滤波器、FFT、RS 编码等。基本模块的质量不用多说，它们就是最简单的单元，实现和常用的方式不会有区别；而高级模块，也都是经过验证的 IP Core，可能在适合实际场景中不是完全最优，当考虑到可以直接调用，也非常值得。

终极的情况下，我们也可以手动调用分立资源，包括寄存器、DSP48、RAM 等，来手动实现设计。因为这些底层资源在 SysGen 中也有模型。所以一般来说 SysGen 生成的代码完全能够达到手写 HDL 代码的优化程度，甚至能够完成 RTL 级的设计。在大部分情况下，不会存在工具的“天花板”。

## 优势与不足

最后，来简单的说一下试用感受吧：

优势：

- 使用 Simulink 从更高层次设计模块
- Simulink 中激励的产生和观察输出都很方便
- 必要时能够进行比较底层的设计
- 路径和资源分析非常直观

不足：

- 编译速度有点慢
- slx 文件版本控制/团队协作比较困难
- Matlab/Vivado 版本升级时对老设计有影响

## 参考

- [SysGen 产品页面][SysGen PG]
- [Mathworks 白皮书][Mathworks WP]
- [HLS on Wikipedia][HLS on Wikipedia]
- [Xilinx 的 SysGen 教程][SysGen Tutorial]
- [Xilinx 的 SysGen 教程配套文件][SysGen Tutorial Files]
- [Xilinx 的 SysGen 用户手册][SysGen UG]
- [Xilinx 的 SysGen 参考手册][SysGen Ref]
- [Xilinx 的 SysGen Hub][SysGen Hub]

[SysGen PG]: https://www.xilinx.com/products/design-tools/vivado/integration/sysgen.html
[HDL Coder]: https://www.mathworks.com/products/hdl-coder.html
[Mathworks WP]: https://www.mathworks.com/tagteam/74244_92077v00_Xilinx_WhitePaper_final.pdf
[HLS on Wikipedia]: https://en.wikipedia.org/wiki/High-level_synthesis
[SysGen UG]: https://www.xilinx.com/support/documentation/sw_manuals/xilinx2017_2/ug897-vivado-sysgen-user.pdf
[SysGen Ref]: https://www.xilinx.com/support/documentation/sw_manuals/xilinx2017_2/ug958-vivado-sysgen-ref.pdf
[SysGen Tutorial]: https://www.xilinx.com/support/documentation/sw_manuals/xilinx2017_2/ug948-vivado-sysgen-tutorial.pdf
[SysGen Tutorial Files]: http://www.xilinx.com/member/forms/download/design-license.html?cid=03131094-cc75-4b06-8410-f0be3ecad521&amp;filename=ug948-design-files.zip
[SysGen Hub]: https://www.xilinx.com/support/documentation-navigation/design-hubs/dh0014-vivado-system-generator-hub.html
