Camera Chat Mod
==================
This mod allows you to type in chat where you want to go, and it sends you there!

Usage
=====
Simply write `/goto 276:217` into the chat box to send your game to the coordinates 276:217. Note, the `c ` MUST have a space after it, and the coordinates must also have a colon between them.

You can also do `/goto alnori wad` to send you to the Alnori system in Wad sector. If the sector name is really long, like `Djophar`, you only need the first three letters. For example, `/goto alnori djo` is the minimum needed.

That's it!

Required Mods
=============
The [RC Mod API](https://github.com/grnt426/RC-Mod-API) is the only required mod.

Install
=====
Dump this file into the `Rising Constellation/dist/main/` directory of wherever your game is installed.

Known Issues
===========
If the coordinates you provide are outside the bounds of the galaxy, such as too small numbers or very large numbers, your screen will turn all black and the client will be useless. I will try to find a way to prevent invalid coordinates from being accepted.

Github
======
[RC Mod CameraChat](https://github.com/grnt426/RC_Mod_CameraChat)