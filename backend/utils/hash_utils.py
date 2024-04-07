import uuid
from snapville.settings import NUM_OF_PARTITIONS
from snapville.settings import DB_LOOKUP

def hash_to_partition(uuid_value, num_partitions=NUM_OF_PARTITIONS):
    """
    Hashes a UUID to an integer representing a partition.

    :param uuid_value: The UUID to be hashed.
    :param num_partitions: The total number of partitions.
    :return: An integer representing the partition number.
    """
    if isinstance(uuid_value, uuid.UUID):
        # It's already a UUID object, so we can directly use .int
        uuid_int =  uuid_value.int
    else:
        # Assume uuid_value is a string, try converting it to UUID object
        try:
            uuid_obj = uuid.UUID(uuid_value)
            uuid_int = uuid_obj.int
        except ValueError:
            # The string is not a valid UUID format
            raise ValueError(f"{uuid_value} is not a valid UUID string")
    
    # Use modulo operation to find the partition
    partition = uuid_int % num_partitions
    return DB_LOOKUP[partition]