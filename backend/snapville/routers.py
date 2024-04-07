class SnapvilleDatabaseRouter:
    """
    A router to control all database operations on models in the
    app_label application for database_a.
    """
    primary = {'tags', 'image_tags'}
    partition = {'images'}

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """
        Make sure the app_label app only appears in the 'database_a'
        database.
        """
        if app_label in self.primary:
            return db == 'default'
        elif app_label in self.partition:
            # Ensure the `images` app is only migrated in the partitions
            return db.startswith('partition')  # Assuming partition databases are named like 'partition0', 'partition1', etc.
        # For any other app, allow migrations in the default database
        return db == 'default'