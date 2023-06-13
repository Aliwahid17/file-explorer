import os

def get_max_depth(path, depth=0):
    if not os.path.isdir(path):
        return depth
    max_depth = depth
    for entry in os.listdir(path):
        full_path = os.path.join(path, entry)
        max_depth = max(max_depth, get_max_depth(full_path, depth + 1))
    return max_depth




def get_folder_depths(path, depth=0, folder_depths={}):
    if not os.path.isdir(path):
        return
    folder_depths[path] = depth
    for entry in os.listdir(path):
        full_path = os.path.join(path, entry)
        get_folder_depths(full_path, depth + 1, folder_depths)

def get_folder(level , path):

    folder_depths = {}
    result = {}
    get_folder_depths(path , folder_depths=folder_depths)

    
    for folder, depth in folder_depths.items():
        if str(depth + 1) in level:
            files = [f for f in os.listdir(folder) if os.path.isfile(os.path.join(folder, f))]
            result[folder] = files
    return result
