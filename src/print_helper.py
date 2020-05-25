import sys
import time


class colors:
    SUCCESS = "\033[92m"
    ERROR = "\033[91m"
    WARNING = "\033[33m"
    NORMAL = "\033[0m"
    INFO = "\033[34m"


def start_sleeping(sleep_time):
    for i in range(1, sleep_time + 1):
        print(f"{i}/{sleep_time}")
        sys.stdout.write("\033[F")
        time.sleep(1)
    print("")
