# Xiaomi Mi AIoT AX6000 刷机教程

## 1. 开始 —— ~~起码先 ssh 连上再说吧！~~
::: info 先决条件
本文假定您有基础 Linux 命令知识（例如 mkdir → 创建文件夹）
:::
::: tip 提示
如果只是为了开 ssh 看这一节就够了.webp
:::
<br>

1.1. 将 [此项目]( https://github.com/openwrt-xiaomi/xmir-patcher ) Clone 到本地，进入源码根目录

<br>
1.2. 执行 run.sh/run.bat （根据操作系统决定）

::: tip 提示
不需要特意创建 venv，这脚本帮你创建了（（（
:::

![awa]( /AX6000/1.webp )
<br><br>

1.3. 将路由器的 **LAN 1** 口用网线接到电脑上

<br><br>
1.4. 确认脚本选项 1 为路由器后台地址，之后选择选项 2 继续

![awa]( /AX6000/2.webp )

> 途中会要求输入 WEB password, 就你路由器后台密码，就像这样 ↓

![awa]( /AX6000/3.webp )

<br><br>
1.5. 如果像下图一样，没有报错 ~~报错了就多试几次~~ ，就可以 ssh 你的路由器啦～，别忘了密码也是 **root**（（（

![awa]( /AX6000/4.webp )

<br><br>
1.6. 登录时可能会出现如下错误：
> Unable to negotiate with 192.168.31.1 port 22: no matching host key type found. Their offer: ssh-rsa

根据 [此页面]( https://techoverflow.net/2022/08/23/how-to-fix-openwrt-ssh-unable-to-negotiate-with-no-matching-host-key-type-found-their-offer-ssh-rsa/ )，应该显式指定不安全的 ssh-rsa 算法

即 `ssh -o HostKeyAlgorithms=+ssh-rsa root@192.168.31.1`
::: tip 提示
关于 ssh_rsa, 可参见 [OpenSSH 的更新日志]( https://www.openssh.com/txt/release-8.8 )
:::
之后即可登录成功。

![awa]( /AX6000/5.webp )

⚡ARE⚡ ⚡YOU⚡ ⚡OK⚡

## 2. 刷机！ —— ~~刷，都可以刷~~

2.1 查看闪存布局 & 当前启动分区

::: tip 提示
从 [此处]( https://openwrt.org/toh/hwdata/xiaomi/xiaomi_mi_aiot_ax6000 ) 获取固件
:::

ssh 路由器后，使用 `cat /proc/mtd` 查看路由器闪存布局，应该类似于下图：

![awa]( /AX6000/6.webp )

重点在 `mtd18` && `mtd19` 分区，即 `rootfs` && `rootfs_1`

<br>

随后执行 `nvram get flag_boot_rootfs` 查看当前启动分区

如果结果为 `0`，就是 `mtd18` 分区，否则为 `mtd19` 分区，下文将以结果为 `0` 作为示例

<br><br>
2.2 发送过渡包

使用 `scp -O /path/to/initramfs-factory.ubi root@192.168.31.1:/tmp` 向路由器的 /tmp 目录发送固件包
::: tip 提示
/path/to/initramfs-factory.ubi 记得替换为实际路径
:::

<br><br>
2.3 刷入过渡包

使用 `ubiformat /dev/mtd19 -y -f /tmp/openwrt-qualcommax-ipq50xx-xiaomi_ax6000-initramfs-factory.ubi && nvram set flag_boot_rootfs=1 && nvram set flag_last_success=1 && nvram commit` 刷入过渡包并设置启动顺序

![awa]( /AX6000/7.webp )

`reboot` 重启路由器 ~~当然你拔电源也可以~~

<br><br>
2.4 固化 OpenWrt

参照 2.2 发送 `squashfs-sysupgrade.bin` 文件到路由器

执行 `ssh root@192.168.1.1` 登录

再执行 `sysupgrade -n /tmp/openwrt-qualcommax-ipq50xx-xiaomi_ax6000-squashfs-sysupgrade.bin` 即可

之后路由器会断开连接并变成黄灯，耐心等待直到白灯常亮就可以了

![awa]( /AX6000/8.webp )

## 基础配置 —— ~~只要能到达那个地方……！~~

3.1 配置镜像源（可选）

登录路由器，执行 `cat /etc/apk/repositories.d/distfeeds.list` 查看目前官方源

![awa]( /AX6000/9.webp )

然后编辑 `/etc/apk/repositories.d/customfeeds.list`

将官方源的 `https://downloads.openwrt.org` 替换为 `https://mirror.nju.edu.cn` 并写入此文件，保存退出

![awa]( /AX6000/10.webp )

执行 `apk update` 更新软件源即可

::: warning 勿使用 `apk upgrade`
摘自 [OpenWrt 官方文档]( https://openwrt.org/docs/guide-user/additional-software/apk )

>**DO NOT USE** apk upgrade to update your packages!

>Doing so will sooner or later brick your device. Several library packages have as-yet unhandled ABI versioned names, which will cause a misconfiguration if you blindly upgrade them (libubus, libustream and many others).

>The safe way to upgrade all packages is to use one of the ASU clients: LuCI Attended Sysupgrade, owut or Firmware Selector.
:::

<br><br>
3.2 安装 Luci 面板

执行 `apk add luci luci-i18n-base-zh-zn` 安装

然后执行 `/etc/init.d/uhttpd enable && /etc/init.d/uhttpd start` 启动 Luci 就好啦

![awa]( /AX6000/11.webp )

<br><br>
3.3 Enjoy !

访问 `192.168.1.1` 就是熟悉的 Luci 面板啦！

![awa]( /AX6000/12.webp )