import requests
dayi_cookie = 'happy-whale-kick-big-panda-by-love-sweet-whale-88830'
cookies = {'dayi-cookie-for-uploads':dayi_cookie}
uuid = dayi_cookie
r = requests.get("http://127.0.0.1:3000/api/get_user_files",cookies=cookies)

print(r.json())

if r.json()['code'] != 201 :
  print( 'Error') # No login
for l in r.json()['data']:
        if l['uuid'] == uuid:
            print(l['file_path'])