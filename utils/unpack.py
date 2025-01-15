"""
A utility to convert LevelDb files to YAML
"""

import os
import shutil
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

def guess_type(entry):
    """
    Guess the type of the entry
    """
    if "pages" in entry:
        return "journal"
    if "text" in entry:
        return "journal.pages"
    return "items"


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
            if os.path.exists(os.path.join(PACK_DIST, pack_dir)):
                shutil.rmtree(os.path.join(PACK_DIST, pack_dir))
            os.makedirs(os.path.join(PACK_DIST, pack_dir))
            db = plyvel.DB(os.path.join(PACK_DIST, pack_dir), create_if_missing=True)
            for file in os.listdir(os.path.join(PACK_SRC, pack_dir)):
                with open(os.path.join(PACK_SRC, pack_dir, file)) as f:
                    current_object = yaml.load(f, Loader=yaml.Loader)
                    if current_object:
                        print(current_object)
                        clean(current_object)
                        object_type = guess_type(current_object)
                        store_id = current_object["_id"]
                        if "_source_id" in current_object:
                            store_id = f"{current_object['_source_id']}.{current_object['_id']}"
                            del current_object["_source_id"]
                        db.put(
                            f"!{object_type}!{store_id}".encode(),
                            json.dumps(current_object).encode()
                        )


if __name__ == "__main__":
    if sys.argv[1] == "unpack":
        unpack()
    else:
        pack()
