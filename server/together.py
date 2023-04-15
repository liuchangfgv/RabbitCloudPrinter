from flask import Flask, request, jsonify
import time
import requests

app = Flask(__name__)
clients = {}
messages = {}

@app.route('/subscribe', methods=['GET'])
def subscribe():
    global clients
    group = request.args.get('group')
    if group not in clients:
        clients[str(group)] = 0
        messages[str(group)] = []
    clients[str(group)] = clients[str(group)] + 1
    try:
        while True:
            if len(messages[str(group)]) != 0:
                clients[str(group)] = clients[str(group)] - 1
                return jsonify({'message': messages[str(group)][0] })
            time.sleep(0.1)
    except Exception as e:
        clients[str(group)] = clients[str(group)] - 1
        return jsonify({'Error': 'Unknow error' })

@app.route('/publish', methods=['POST'])
def publish():
    message = request.get_json()['message']
    group = request.get_json()['group']
    if group not in clients:
        clients[str(group)] = 0
        messages[str(group)] = []
    messages[str(group)].append(message)
    while clients[str(group)]:
        pass
    messages[str(group)].remove(message)
    return jsonify({'message': 'Message sent to all clients'})

if __name__ == '__main__':
    app.run()

    
# 长轮询python实现
# subscribe curl test：
#  curl http://localhost:5000/subscribe?group=1
# publish curl test:
#  curl -H "Content-Type: application/json" -X POST -d '{"message": "Hello, World!","group":"1"}' http://localhost:5000/publish
