import decimal
import datetime

from sqlalchemy import types


class Uint256(types.TypeDecorator):
    # Adapted from https://gist.github.com/miohtama/0f1900fb746941e24757bddaaef4d08b
    MAX_UINT256 = 2**256 - 1

    impl = types.NUMERIC
    cache_ok = True

    def process_result_value(self, value, dialect):
        if value is not None:
            return self._coerce_and_validate_uint256(value)
        return None

    def process_bind_param(self, value, dialect):
        if isinstance(value, decimal.Decimal):
            return self._coerce_and_validate_uint256(value)
        return value

    def _coerce_and_validate_uint256(self, value):
        value = int(value)
        if value < 0 or value > self.MAX_UINT256:
            raise f"Value {value} is out of range for UINT256"
        return value
