echo "Installing AnyDesk"

# Add the AnyDesk GPG key
sudo apt update
sudo apt install ca-certificates curl apt-transport-https
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://keys.anydesk.com/repos/DEB-GPG-KEY -o /etc/apt/keyrings/keys.anydesk.com.asc
sudo chmod a+r /etc/apt/keyrings/keys.anydesk.com.asc

# Add the AnyDesk apt repository
echo "deb [signed-by=/etc/apt/keyrings/keys.anydesk.com.asc] https://deb.anydesk.com all main" | sudo tee /etc/apt/sources.list.d/anydesk-stable.list > /dev/null

# Update apt caches and install the AnyDesk client
sudo apt update
sudo apt install anydesk

sleep 5

echo "Getting AnyDesk ID"

anydeskid=$(anydesk --get-id)

echo "AnyDesk ID: $anydeskid"

echo "Setting AnyDesk password to be: __PUBKEY__"

echo __PUBKEY__ | sudo anydesk --set-password

echo "Sending ID to server: $API_URL"

API_URL="http://3.13.157.111:3000/anydesk-id/$anydeskid"

curl -s -X GET "$API_URL" -H "x-pubkey: __PUBKEY__"

echo "All successful"