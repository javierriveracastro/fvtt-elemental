"""
A utility to convert LevelDb files to YAML
"""

import os
import sys

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
                    print(key, current_object)
                    name = current_object["name"]
                    clean(current_object)
                    current_object["ownership"] = {"default": 0}
                    with open(os.path.join(PACK_SRC, possible_db, name), 'w') as file:
                        file.write(yaml.dump(current_object, Dumper=Dumper))


def pack():
    for pack_dir in os.listdir(PACK_SRC):
        if os.path.isdir(os.path.join(PACK_SRC, pack_dir)):
            print("Find pack", pack_dir)
            db = plyvel.DB(os.path.join(PACK_DIST, pack_dir), create_if_missing=True)
            for file in os.listdir(os.path.join(PACK_SRC, pack_dir)):
                with open(os.path.join(PACK_SRC, pack_dir, file)) as f:
                    current_object = yaml.load(f, Loader=yaml.Loader)
                    print(current_object)
                    clean(current_object)
                    db.put(
                        f"!items!{current_object._id}",
                        json.dumps(current_object).encode()
                    )


if __name__ == "__main__":
    if sys.argv[1] == "pack":
        pack()
    else:
        unpack()
