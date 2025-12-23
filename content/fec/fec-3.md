---
title: FEC 2 - BCH 码
date: 2025-12-23
---

**BCH** 码（Bose–Chaudhuri–Hocquenghem 码）是在有限域上通过多项式构造的一类线性、循环纠错码。历史上由 Alexis Hocquenghem 于 1959 年首先提出，随后由 R. C. Bose 和 D. K. Ray‑Chaudhuri 于 1960 年独立发展——故称 BCH 码。形式上 BCH 码定义在 $GF(q)$ 上，$q$ 不必为 2，因此并非只限二进制，但在工程应用中二进制 BCH（$q=2$）最为常见，本文也仅讨论二进制 BCH 码。

BCH 码的核心特性是可按“设计距离”精确控制最小距离 $d$，从而保证可纠正至多 $t = \left\lfloor (d−1)/2 \right\rfloor$ 个符号（对二进制即比特）错误。译码通常基于计算伴随式（Syndromes）并求解错误定位多项式，常用译码算法包括 Peterson‑Gorenstein‑Zierler、Berlekamp‑Massey、以及基于扩展欧几里得算法的 Sugiyama 方法；定位多项式的根可用 Chien 搜索快速找到相应错误位置。由于这些代数化译码过程可用有限域运算实现，BCH 码在硬件中实现时复杂度和资源消耗相对可控，适于低功耗实现。

在介绍什么是 BCH 码之前，我们先介绍怎么构造一个 BCH 码。

## BCH 码的构造

构造 BCH 码是我们需要一些输入：

- 字母表：$GF(2)$
- 码长：$n = 2^m - 1$，其中 $m$ 为一正整数
- 最小汉明距离：$d_{min}$

给定正整数 $m$ 以及设计距离 $d_{min}$（需满足 $d_{min} \leq 2^m - 1$）。一个码长 $n = 2^m - 1$、最小距离至少为 $d_{min}$ 的**本原窄义 BCH 码**的构造步骤如下：

1. 选取 $GF(2^m)$ 的一个本原元素 $\alpha$（通常取为构造本原多项式 $p(x)$ 的一个根）
2. 对任意正整数 $i < d_{min}$，求 $\alpha^i$ 在 $GF(2)$ 上的最小多项式 $m_i(x)$
3. 生成多项式定义为这些最小多项式的最小公倍数：

   $$
   g(x) = \operatorname{LCM}\bigl(m_1(x), m_2(x), \dots, m_{d_{min}-1}(x)\bigr)
   $$

可以知道以下的特质：

- $g(x)$ 是 $GF(2)$ 上的多项式
- $g(x)$ 可以整除 $x^n - 1$，因此利用 $g(x)$ 定义的码是循环码

### 示例 1 - BCH (7, 4) 码

设定参数：

- $m = 3$
- $d_{min} = 3$
- $GF(2^m)$ 由本原多项式 $p(x) = x^3 + x^2 + 1$ 构造

构造步骤：

1. 选取 $GF(2^3)$ 的本原元素 $\alpha = 2$
2. 最小多项式为

   $$
   m_1(x) = m_2(x) = x^3 + x^2 + 1
   $$

3. 生成多项式为

   $$
   g(x) = \operatorname{LCM}\bigl(m_1(x), m_2(x)\bigr) = m_1(x) = x^3 + x^2 + 1
   $$

4. 设计距离 $d_{min} = 3$，可纠正 1 位错误。生成多项式次数为 3，对应 3 个校验位、4 个信息位，得到 BCH (7, 4) 码

这正是[第一篇文章](./fec-1.md)中讨论的 Hamming (7, 4) 码。

### 示例 2 - BCH (15, 7)

设定参数：

- $m = 4$
- $d_{min} = 5$
- $GF(2^m)$ 由本原多项式 $p(x) = x^4 + x + 1$ 构造

构造步骤：

1. 选取 $GF(2^4)$ 的本原元素 $\alpha = 2$
2. 最小多项式为

   $$
   \begin{aligned}
   m_1(x) &= m_2(x) = m_4(x) = x^4 + x + 1 \\
   m_3(x) &= x^4 + x^3 + x^2 + x + 1
   \end{aligned}
   $$

3. 生成多项式为

   $$
   \begin{aligned}
   g(x) &= \operatorname{LCM}\bigl(m_1(x), m_2(x), m_3(x), m_4(x)\bigr) \\
        &= m_1(x) \cdot m_3(x) \\
        &= (x^4 + x + 1)(x^4 + x^3 + x^2 + x + 1) \\
        &= x^8 + x^7 + x^6 + x^4 + 1
   \end{aligned}
   $$

4. 设计距离 $d_{min} = 5$，可纠正 2 位错误。生成多项式次数为 8，对应 8 个校验位、7 个信息位，因此是 BCH (15, 7) 码。

这种 BCH 码常用于二维码。

### 性质

根据生成多项式的构造可知，其生成多项式 $g(x)$ 在扩展域 $GF(2^m)$ 上拥有连续根：$\alpha, \alpha^2, \dots, \alpha^{d_{min}-1}$。注意生成多项式在 $GF(2)$ 上，即其系数都属于 $GF(2)$，而根在扩域 $GF(2^m)$ 中。这个特性在 BCH 解码的过程中非常重要。

## BCH 码的编码

BCH 码属于多项式码，编码可用多项式长除法实现：

$$
\begin{aligned}
d(x) \cdot x^{n-k} &= q(x) \cdot g(x) + r(x) \\
c(x) &= d(x) \cdot x^{n-k} + r(x)
\end{aligned}
$$

其中 $d(x)$ 为信息多项式，$r(x)$ 为校验多项式，$c(x)$ 为编码之后的码字多项式。

同时 BCH 码同时也是线性码，编码也可通过生成矩阵 $G$ 完成：

$$
\bm{c} = \bm{d} \cdot \bm{G}
$$

## BCH 码的译码

### 计算伴随式

译码算法的第一步都是计算伴随式，以判断接收序列是否为合法码字。

作为多项式码，可将接收多项式对生成多项式 $g(x)$ 做长除法，若余式 $r(x) = 0$，则假定无误码。

同时作为线性码，可用校验矩阵 $H$ 计算综合：

$$
\bm{S} = \bm{v} \cdot \bm{H}^T
$$

上述两种计算出的伴随式的值的都是二进制的。此外，由 BCH 的构造过程可知，$\{\alpha, \alpha^2, \dots, \alpha^{d_{min}-1}\}$ 是生成多项式在扩展域中的根。于是还可以把接收到的码字视为多项式 $z(x)$ ，然后在扩展域上的这些点求值，得到另一种伴随式：

$$
S_j = z(\alpha^j) = c(\alpha^j) + e(\alpha^j) = e(\alpha^j)
$$

其中：

$$
j = 1, 2, \dots, d_{min}-1
$$

### 定位错误

下一步需要确定错误个数并找到位置。假设共有 $\nu$ 个错误，位置为 $i_1, i_2, \dots, i_{\nu}$，则错误多项式为：

$$
e(x) = e_{i_1} x^{i_1} + e_{i_2} x^{i_2} + \dots + e_{i_{\nu}} x^{i_{\nu}}
$$

其中 $e_{i_j}$ 表示位置 $i_j$ 的错误，$j = 0, 1, \dots, \nu-1$，$i_j \in {0, 1, \dots, n-1}$。对于二进制 BCH 码，错误值为 1，但保留 $e_{i_j}$ 这个符号便于理解。

以 $d_{min} = 5$、$\nu = 2$ 为例，需要解方程组：

$$
\begin{aligned}
S_1 &= e_{i_1} \alpha^{i_1} + e_{i_2} \alpha^{i_2} \\
S_2 &= e_{i_1} \alpha^{2 i_1} + e_{i_2} \alpha^{2 i_2} \\
S_3 &= e_{i_1} \alpha^{3 i_1} + e_{i_2} \alpha^{3 i_2} \\
S_4 &= e_{i_1} \alpha^{4 i_1} + e_{i_2} \alpha^{4 i_2}
\end{aligned}
$$

未知数有 $i_1, i_2$ 两个，方程有 4 个，但这一组方程为非线性方程组，所以实际上并没有冗余。若 $n$、$\nu$ 较小，可用穷举，复杂度约 $O(n^{\nu})$，一般不实用。

#### 错误定位多项式

定义错误定位多项式：

$$\Lambda(x) = \prod_{j=1}^{\nu}(x \cdot \alpha^{i_j} - 1) = 1 + \lambda_1 x + \lambda_2 x^2 + \dots + \lambda_{\nu} x^{\nu}$$

其根为 $\alpha^{i_j}$，从而给出错误位置。求系数 $\lambda_i$ 的常用算法有：

- Peterson-Gorenstein-Zierler（PGZ）算法
- Berlekamp-Massey（BM）算法
- Sugiyama 欧几里得算法

#### Peterson-Gorenstein-Zierler（PGZ）算法

Peterson 算法直接求错误定位多项式的系数。假设有 $\nu$ 个错误，系数满足：

$$
S_{\nu \times \nu}
\begin{bmatrix}
\lambda_{\nu} \\
\lambda_{\nu-1} \\
\vdots \\
\lambda_1
\end{bmatrix}
= -
\begin{bmatrix}
S_{\nu+1} \\
S_{\nu+2} \\
\vdots \\
S_{\nu+\nu}
\end{bmatrix}
$$

其中

$$
S_{\nu \times \nu} =
\begin{bmatrix}
S_{1+0} & S_{1+1} & \dots & S_{1+\nu-1} \\
S_{2+0} & S_{2+1} & \dots & S_{2+\nu-1} \\
\vdots & \vdots & \ddots & \vdots \\
S_{\nu+0} & S_{\nu+1} & \dots & S_{\nu+\nu-1}
\end{bmatrix}
$$

若矩阵 $S_{\nu \times \nu}$ 行列式非零，则可求逆进而得到各 $\lambda_i$。若 $\det(S_{\nu \times \nu}) = 0$，则将 $\nu$ 减 1 重试。

#### Chien 搜索

得到错误定位多项式 $\Lambda(x)$ 后，其根可写为 $\Lambda(x) = (\alpha^{i_1}x - 1)(\alpha^{i_2}x - 1) \dots (\alpha^{i_{\nu}}x - 1)$。可对 $GF(p^m)$ 的全部 $n$ 个元素逐一代入测试，复杂度约 $O(n)$。

#### 错误值

对于二进制 BCH 码，定位到错误位置后，直接翻转这些比特即可完成纠错。

## 总结

我们详细介绍了 BCH 码的构造、编码与解码过程。
