#!/bin/bash
kill -9 `ps -aux | grep node | grep -v grep | awk '{print $2}'` 
