from flask import Flask, request, jsonify
import time
from flask_cors import CORS

app = Flask(__name__)
clients = {}
messages = {}

@app.route('/subscribe/<group>')
def subscribe(group):
    global clients
    if group not in clients:
        clients[str(group)] = 0
        messages[str(group)] = []
    clients[str(group)] = clients[str(group)] + 1
    try:
        while True:
            if len(messages[str(group)]) != 0:
                clients[str(group)] = clients[str(group)] - 1
                return jsonify({'message': messages[str(group)][0] ,'code':0})
            time.sleep(0.1)
    except Exception as e:
        clients[str(group)] = clients[str(group)] - 1
        return jsonify({'Error': 'Unknow error','code':-2})

@app.route('/publish/<group>', methods=['POST'])
def publish(group):
    try:
        message = request.get_json()['message']
    except Exception:
        return jsonify({'Error': 'No Message','code':-1})
    if group not in clients:
        clients[str(group)] = 0
        messages[str(group)] = []
    messages[str(group)].append(message)
    while clients[str(group)]:
        pass
    messages[str(group)].remove(message)
    return jsonify({'message': 'Message sent to all clients','code':0})


CORS(app, resources=r'/*') #测试时临时解决跨域问题使用
if __name__ == '__main__':
    app.run()

    
# 长轮询python实现
# subscribe curl test：
#  curl http://localhost:5000/subscribe/1
# publish curl test:
#  curl -H "Content-Type: application/json" -X POST -d '{"message": "Hello, World!"}' http://localhost:5000/publish/1
