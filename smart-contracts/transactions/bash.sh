#! /bin/bash

# SET RADIX BUCKET VARIABLE
rdx=resource_sim1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzqu57yag

# CREATE FIRST ACCOUNT
output1=$(resim new-account)
export ac1="$( echo ${output1} | cut -b 60-121)"
export pv1="$( echo ${output1} | cut -b 215-279)"


# CREATE SECONDARY ACCOUNT
output2=$(resim new-account)
export ac2="$( echo ${output2} | cut -b 60-121)"
export pv2="$( echo ${output2} | cut -b 215-279)"


echo "VARS"
echo "account1"
echo $ac1
echo "private key1"
echo $pv1
echo "account2"
echo $ac2
echo "private key2"
echo $pv2
echo "package"
echo $pkg
echo "component"
echo $comp
#echo "item vendor account"
#echo $itemVendorAccount


# CHECK RESOURCES OF ACCOUNT 2
#resim show $ac2
