"""Change hourly_rate to float (SQLite-safe)

Revision ID: 6b6da0a1fc74
Revises: d01daf287252
Create Date: 2025-11-30 22:48:22.779839
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "6b6da0a1fc74"
down_revision: Union[str, None] = "d01daf287252"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """
    SQLite does not support ALTER COLUMN TYPE.
    So we recreate the table with the correct type.
    """

    # 1. Create a new temporary table with the correct schema.
    op.create_table(
        "instructors_tmp",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("user_id", sa.Integer, unique=True),
        sa.Column("certificate_body", sa.String(5), nullable=False),
        sa.Column("level_of_qualification", sa.String(6), nullable=False),
        sa.Column("years_of_experience", sa.Integer, nullable=False),
        sa.Column("local_resort", sa.String),
        sa.Column("hourly_rate", sa.Float),  # NEW TYPE
    )

    # 2. Copy the data from the old table
    op.execute("""
        INSERT INTO instructors_tmp (
            id, user_id, certificate_body, level_of_qualification,
            years_of_experience, local_resort, hourly_rate
        )
        SELECT
            id, user_id, certificate_body, level_of_qualification,
            years_of_experience, local_resort, hourly_rate
        FROM instructors;
    """)

    # 3. Drop old table
    op.drop_table("instructors")

    # 4. Rename temp table to original name
    op.rename_table("instructors_tmp", "instructors")


def downgrade() -> None:
    """
    Reverse of upgrade — recreate the table with INTEGER hourly_rate again.
    """

    op.create_table(
        "instructors_tmp",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("user_id", sa.Integer, unique=True),
        sa.Column("certificate_body", sa.String(5), nullable=False),
        sa.Column("level_of_qualification", sa.String(6), nullable=False),
        sa.Column("years_of_experience", sa.Integer, nullable=False),
        sa.Column("local_resort", sa.String),
        sa.Column("hourly_rate", sa.Integer),  # OLD TYPE
    )

    op.execute("""
        INSERT INTO instructors_tmp (
            id, user_id, certificate_body, level_of_qualification,
            years_of_experience, local_resort, hourly_rate
        )
        SELECT
            id, user_id, certificate_body, level_of_qualification,
            years_of_experience, local_resort, hourly_rate
        FROM instructors;
    """)

    op.drop_table("instructors")

    op.rename_table("instructors_tmp", "instructors")
