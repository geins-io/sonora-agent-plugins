- **Float parameters need a period decimal.** Values exported with a comma (`4,0`, common in Swedish
  data) do not parse as Float: convert them, or store them under a String parameter. *(unverified)*
- **Parameter values are sent as strings**, whatever the parameter's type. *(unverified)*
