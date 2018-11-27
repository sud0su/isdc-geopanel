# iMMAP Panel Module

## Installation

`pip install immap-panel-module`

## Intergrating into ASDC

- add `immap-panel-module` into `INSTALLED_APPS`

- add this code into `local_setting.py`

```python
IMMAP_LIST_PACKAGE = []
if 'immap-panel-module' in INSTALLED_APPS:
    if 'immap-baseline-module' in INSTALLED_APPS:
        IMMAP_LIST_PACKAGE += [{
            'package' : 'immap-baseline-module',
            'js' : 'js/baseline.js'
        }]
IMMAP_PACKAGE = {'official_package': IMMAP_LIST_PACKAGE }
```

- add this code into `contect_processors.py`

```python
IMMAP_PACKAGE=getattr(
    settings,
    "IMMAP_PACKAGE",
    False)
```

- Add this code into `geonode/maps/templates/maps/map_view.html`

```html
{% block extra_script %}
    {% if 'immap-panel-module' in INSTALLED_APPS %}
        <script language="javascript">
            var STATIC_URL = "{{ STATIC_URL }}";
            var JS_PACKAGE = "{{IMMAP_PACKAGE}}";
        </script>
        {% include 'immap-panel-module/panel.html' %}
    {% endif %}
{% endblock extra_script %}
```
