
# Screen window manager in Linux terminal

First, run a `screen` command so that you start a screen window manager. This immediatelly attaches you to the new screen:

```
screen
```

You can check the running screen sessions with the `screen -list` command:

```
screen -list
```

Once in the screen, you can run a program and if you detach from that screen the program will continue running. Detaching is one with the keyboard shortcut `Ctrl-a d`. You can attach yourself again to the detached screen with `screen -r` command:

```
screen -r
```

If there are multiple screen sessions you will have to choose the one you want to attach.Just write a few first screen id numbers after the `screen -r` command (screen id number is visible with `screen -list`):

```
screen -r 5241
```

If you want to terminate screen, just attach yourself to its windows and run `exit` command.

```
exit
```


control +a +d detach screen
