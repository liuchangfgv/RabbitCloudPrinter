from mutagen.easyid3 import EasyID3
import urllib.request
import urllib.parse
import json
import difflib

def getLyric(path):
    tags = EasyID3(path)
    url1 = 'http://s.music.163.com/search/get/?type=1&s=' + urllib.parse.quote(tags['title'][0]) + '&limit=50'
    body = {}
    try:
        with urllib.request.urlopen(url1) as response:
            body = json.loads(response.read())
            headers = response.getheaders()
            status = response.getcode()
    except urllib.error.URLError as e:
        return 'Error'
    a = []
    for i in body['result']['songs']:
        a.append(difflib.SequenceMatcher(None,tags['title'][0],i['name']).quick_ratio() + 5 * difflib.SequenceMatcher(None,tags['artist'][0],i['artists'][0]['name']).quick_ratio())
        # 寻找最相似的
    max_like = a.index(max(a))
    url2 = 'https://music.163.com/api/song/media?id=' + str(body['result']['songs'][max_like]['id'])
    try:
        with urllib.request.urlopen(url2) as response:
            body = json.loads(response.read())
            headers = response.getheaders()
            status = response.getcode()
    except urllib.error.URLError as e:
        return 'Error To get Lyric'
    return body['lyric'].replace("\\n", "\n").replace("\\r", "\r")