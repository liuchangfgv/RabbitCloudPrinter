from flask import Flask, request, jsonify
import time
from flask_cors import CORS
import uuid

app = Flask(__name__)
clients = {}
messages = {}

@app.route('/subscribe/<group>')
def subscribe(group):
    global clients
    if group not in clients:
        return jsonify({'Error': 'No Group','code':-3})
    clients[str(group)] = clients[str(group)] + 1
    try:
        while True:
            if str(group) not in messages:
                return jsonify({'Error': 'No Group','code':-3})
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
        return jsonify({'Error': 'No Group','code':-3})
    messages[str(group)].append(message)
    try: # 可能在轮询时遇到组解散的问题
        while clients[str(group)]:
            pass
    except Exception:
        return jsonify({'Error': 'No Group','code':-3})
    messages[str(group)].remove(message)
    return jsonify({'message': 'Message sent to all clients','code':0})

@app.route('/creategroup')
def creategroup():
    randUuid = uuid.uuid1()
    while str(randUuid) in clients:
        randUuid = uuid.uuid1()
    clients[str(randUuid)] = 0
    messages[str(randUuid)] = []
    return jsonify({'group': str(randUuid),'code':0})

@app.route('/removegroup', methods=['POST'])
def removegroup():
    group = request.get_json()['group']
    try:
        clients.pop(str(group))
    except Exception:
        return jsonify({'Error': 'No Group','code':-3})
    messages.pop(str(group))
    return jsonify({'Error': 'Success','code':0})

CORS(app, resources=r'/*') #测试时临时解决跨域问题使用
if __name__ == '__main__':
    app.run()

    
# 长轮询python实现
# subscribe curl test：
#  curl http://localhost:5000/subscribe/1
# publish curl test:
#  curl -H "Content-Type: application/json" -X POST -d '{"message": "Hello, World!"}' http://localhost:5000/publish/1
