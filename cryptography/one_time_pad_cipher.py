
import random
plain_text = "moussa ate the banana"
# generate random key of sam size as the plain_text
size_plain_text = len(plain_text)
key_str = ""
key_int = 0
a = ord('a')
z = ord('z')
for _ in range(size_plain_text):
    # generate a random character between a and z
    random_character_integer = random.randint(a, z + 1)
    key_int += random_character_integer
    key_str += str(chr(random_character_integer))
print("Generated Random Key : ", key_str)

# now encrypt the text
cipher = []
for p in plain_text:
    c = key_int ^ ord(p)
    cipher.append(c)

print("Plain Text : \"", plain_text, "\"")
print("Generated Cipher : ")
for c in cipher:
    print(chr(c), end='')

# now let us try to decrypt the cipher with the key
decrypted_text = []
for c in cipher:
    decrypted_text.append(chr(key_int ^ c))

print("\n Decrypted Text Is : \"", ''.join(decrypted_text),"\"")
