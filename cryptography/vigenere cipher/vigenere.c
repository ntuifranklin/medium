#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <ctype.h>
#include <limits.h>
#include "cipher_constants.h"
#include "utilities.h"

int main(int argc, char * argv[]) {
    int i ;
    char givenText[MAXTEXTSIZE] ;
    char * plainText ;
    char key[MAXTEXTSIZE] ;
    char option[OPTION_SIZE] ;
    char * generatedKey  ;
    char * cipherText ;
    char * decryptedText ;
    if (argc != 4 ) {
        printf("\nUsage %s -e | -d encryption_key text_to_encrypt/decrypt\n", argv[0]);
        return EXIT_FAILURE;
    } else if (  (strncmp(argv[1], ENCIPHER, (OPTION_SIZE-1)) != 0 && strncmp(argv[1], DECIPHER, (OPTION_SIZE-1)) != 0 ) ) {

        printf("\nUsage %s -e | -d encryption_key text_to_encrypt/decrypt\n", argv[0]);
        return EXIT_FAILURE;
    }

    /* fill both option, key and plain text with null bytes */
    memset(option, OPTION_SIZE, '\0');
    memset(key, MAXTEXTSIZE, '\0');
    memset(givenText, MAXTEXTSIZE, '\0');

    /* copy at most MAXTEXTSIZE-1 characters from command line options to key and plain text respectfully */
    strncpy(option, argv[1], (OPTION_SIZE-1));
    strncpy(key, argv[2], (MAXTEXTSIZE-1));
    strncpy(givenText, argv[3], (MAXTEXTSIZE-1));

    generatedKey = generateSameSizeKey(key, strlen(key), strlen(givenText)) ;

    if (strncmp(option, ENCIPHER, (OPTION_SIZE-1)) == 0) {
        
        generatedKey = generateSameSizeKey(key, strlen(key), strlen(givenText)) ;
        cipherText = encrypt(key, strlen(key), givenText, strlen(givenText));
        printf("Plain Text: %s\n", givenText);
        printf("Key : %s\n", key);
        printf("Generated Key : %d\n", generatedKey);
        printf("Cipher Text : %s\n", cipherText);
        
    } else {
        
        decryptedText = decrypt(generatedKey, strlen(generatedKey), givenText, strlen(givenText));
        printf("Cipher Text: %s\n", givenText);
        printf("Key : %s\n", key);
        printf("Generated Key : %d\n", generatedKey);
        
        printf("Decrypted Cipher Text %s\n", decryptedText);
    }
    
    return EXIT_SUCCESS;
}