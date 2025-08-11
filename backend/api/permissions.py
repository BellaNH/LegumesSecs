

DEFAULT_PERMISSIONS = [
    {"model": "Agriculteur", "create": False, "retrieve": False, "update": False, "destroy": False},
    {"model": "Exploitation", "create": False, "retrieve": False, "update": False, "destroy": False},
    {"model": "Objectif", "create": False, "retrieve": False, "update": False, "destroy": False},
    {"model": "Utilisateur", "create": False, "retrieve": False, "update": False, "destroy": False},

]
  

def build_permissions(input_permissions):
    input_perm_dict = {p['model']: p for p in input_permissions}

    result = []

    for default_perm in DEFAULT_PERMISSIONS:
        model_name = default_perm['model']
        base = default_perm.copy()

        if model_name in input_perm_dict:
            input_perm = input_perm_dict[model_name]

            for action in ['create', 'retrieve', 'update', 'destroy']:
                if action in input_perm:
                    base[action] = input_perm[action]

        result.append(base)

    return result
