import yaml

config_path = "../../config/config.yaml"

def get_server_port():
  with open(config_path, "r",encoding="utf-8") as f:
    config = yaml.load(f, Loader=yaml.FullLoader)
    server_port = config["server_port"]
  return server_port

def get_server_api_key():
  with open(config_path, "r",encoding="utf-8") as f:
    config = yaml.load(f, Loader=yaml.FullLoader)
    auth_inside_server_api_key = config["auth_inside_server_api_key"]
  return auth_inside_server_api_key