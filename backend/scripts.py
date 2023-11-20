import datetime
import random
import threading
import requests

def post_log(thread_number):
    for i in range(100000):
        body = {
            "level": random.choice(["error", "fraud_error", "success", "dev_error"]),
            "message": "Failed to connect to Server",
            "resourceId": "server-1234",
            "timestamp":datetime.datetime.now().timestamp(),
            "traceId": "abc-xyz-" + str(random.randint(100, 999)),
            "spanId": "span-" + str(random.randint(100, 999)),
            "commit": "5e5342f",
            "metadata": {"parentResourceId": "server-" + str(random.randint(1000, 9999))},
        }
        res = requests.post("http://localhost:3000/", json=body)
        print(thread_number, i)
    # print("Thread " + thread_number + " completed!")

threads = []

for i in range(100):
    thread = threading.Thread(target=post_log, args=(i,))
    threads.append(thread)
    thread.start()

for thread in threads:
    thread.join()