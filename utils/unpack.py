"""
A utility to convert LevelDb files to YAML
"""

import os
import plyvel
import yaml
import json
from yaml import CDumper as Dumper

PACK_DIST = "../fvtt-elemental/packs"
PACK_SRC = "../pack_source"


def clean(foundry_object):
    """
    Cleans one object
    """
    if "_stats" in foundry_object:
        del foundry_object["_stats"]
    foundry_object["ownership"] = {"default": 0}


def unpack():
    for possible_db in os.listdir(PACK_DIST):
        print("Scanning,", possible_db)
        if os.path.isdir(os.path.join(PACK_DIST, possible_db)):
            if not os.path.exists(os.path.join(PACK_SRC, possible_db)):
                os.makedirs(os.path.join(PACK_SRC, possible_db))
            else:
                for file in os.listdir(os.path.join(PACK_SRC, possible_db)):
                    os.remove(os.path.join(PACK_SRC, possible_db, file))
            with plyvel.DB(os.path.join(PACK_DIST, possible_db)) as db:
                for key, value in db:
                    current_object = json.loads(value)
                    name = current_object["name"]
                    clean(current_object)
                    current_object["ownership"] = {"default": 0}
                    with open(os.path.join(PACK_SRC, possible_db, name), 'w') as file:
                        file.write(yaml.dump(current_object, Dumper=Dumper))


if __name__ == "__main__":
    unpack()
