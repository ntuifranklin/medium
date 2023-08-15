#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <ctype.h>
#include <limits.h>

#include "cipher_constants.h"
#include "utilities.h"

int main(int argc, char * argv[]) {
    int i ;
    char plainText[MAXTEXTSIZE] ;
    char key[MAXTEXTSIZE] ;
    char * generatedKey = NULL ;

    char * cipherText = NULL;


    
    if (argc != 3 ) {
        
        printf("\nUsage %s <encryption_key> <text_to_encrypt>\n\n", argv[0]);
        return EXIT_FAILURE;
    }
    
    printf("%d",CRYPTABET_SIZE);
    /* fill both key and plain text with null bytes */
    memset(plainText, MAXTEXTSIZE, '\0');
    memset(key, MAXTEXTSIZE, '\0');

    /* copy at most MAXTEXTSIZE-1 characters from command line options to key and plain text respectfully */
    strncpy(key, argv[1], (MAXTEXTSIZE-1));
    strncpy(plainText, argv[2], (MAXTEXTSIZE-1));

    generatedKey = generateSameSizeKey(key, strlen(key), strlen(plainText)) ;

    cipherText = encrypt(key, strlen(key), plainText, strlen(plainText));
    printf("Plain Text: %s\n", plainText);
    printf("Key : %s\n", key);
    printf("Cipher Text : %s\n", cipherText);
    printf("Generated Key : %d\n", generatedKey);
    printf("Decrypting Cipher Text %s\n", cipherText);

    char * decryptedText = decrypt(generatedKey, strlen(generatedKey), cipherText, strlen(cipherText));

    printf("Decrypted Text %s\n", decryptedText);


    
    return EXIT_SUCCESS;
}