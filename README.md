# show-json

Extract and show JSON data in various formats

    Usage: show-json [options] [filename]

    Options:
        -c, --columns       Columns to display
        -h, --help          Print usage
        -r, --root          Root path in input

# Example usage

    # cat sample.json | show-json
    ┏━━━━━┳━━━━┳━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━┓
    ┃ age ┃ id ┃ name          ┃ occupation.name     ┃ occupation.since ┃
    ┣━━━━━╋━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━━┫
    ┃ 37  ┃ 1  ┃ Fred Williams ┃ Plumber             ┃ 1996             ┃
    ┃ 40  ┃ 2  ┃ Joe Smith     ┃ Accountant          ┃ 1998             ┃
    ┃ 50  ┃ 3  ┃ Mary Simpson  ┃ Marketing executive ┃ 1989             ┃
    ┗━━━━━┻━━━━┻━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━━━━┛

    # cat sample.json | show-json -c name,age,occupation.name
    ┏━━━━━━━━━━━━━━━┳━━━━━┳━━━━━━━━━━━━━━━━━━━━━┓
    ┃ name          ┃ age ┃ occupation.name     ┃
    ┣━━━━━━━━━━━━━━━╋━━━━━╋━━━━━━━━━━━━━━━━━━━━━┫
    ┃ Fred Williams ┃ 37  ┃ Plumber             ┃
    ┃ Joe Smith     ┃ 40  ┃ Accountant          ┃
    ┃ Mary Simpson  ┃ 50  ┃ Marketing executive ┃
    ┗━━━━━━━━━━━━━━━┻━━━━━┻━━━━━━━━━━━━━━━━━━━━━┛

    # cat sample.json | show-json -c 'name as Full Name, age as Age'
    ┏━━━━━━━━━━━━━━━┳━━━━━┓
    ┃ Full Name     ┃ Age ┃
    ┣━━━━━━━━━━━━━━━╋━━━━━┫
    ┃ Fred Williams ┃ 37  ┃
    ┃ Joe Smith     ┃ 40  ┃
    ┃ Mary Simpson  ┃ 50  ┃
    ┗━━━━━━━━━━━━━━━┻━━━━━┛
