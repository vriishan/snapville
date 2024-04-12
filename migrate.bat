
python backend/manage.py makemigrations --name primary tags
python backend/manage.py makemigrations --name primary image_tags
python backend/manage.py makemigrations --name primary users
python backend/manage.py makemigrations --name primary user_images
python backend/manage.py makemigrations --name partitions images

python backend/manage.py migrate --database default
python backend/manage.py migrate --database partition0
python backend/manage.py migrate --database partition1
python backend/manage.py migrate --database partition2
python backend/manage.py migrate --database partition3
python backend/manage.py migrate --database partition4
