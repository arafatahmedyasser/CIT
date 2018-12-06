/*************************************************************************
 
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
 * 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.
 
 *************************************************************************/

package com.intellectdesign.canvas.servercomm.encryption;

import java.io.UnsupportedEncodingException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.Key;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.Security;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import org.apache.commons.codec.DecoderException;

/**
 * 
 * AES implementation for the encryption engine interface , this class facilitates encryption , decryption and other
 * util methods related to the AES Algorithms
 * 
 * @version 1.0
 */
public class AESEngine implements EncryptionEngine
{
	/**
	 * 
	 * AES implementation for the encryption engine interface , this class facilitates encryption , decryption and other
	 * util methods related to the AES Algorithms
	 */
	public AESEngine()
	{

		// adding bouncry castle as the security provider
		Security.addProvider(new org.bouncycastle.jce.provider.BouncyCastleProvider());

	}

	/**
	 * AES key used to encrypt the data This method gets utf8 encoded string data and returns byte array of the
	 * encrypted data
	 * 
	 * @param data
	 * @param key
	 * @return byte
	 * @throws NoSuchAlgorithmException
	 * @throws NoSuchProviderException
	 * @throws NoSuchPaddingException
	 * @throws InvalidKeyException
	 * @throws InvalidAlgorithmParameterException
	 * @throws IllegalBlockSizeException
	 * @throws BadPaddingException
	 * @see com.intellectdesign.canvas.servercomm.encryption.EncryptionEngine#encrypt(java.lang.String, java.security.Key)
	 */
	@Override
	public byte[] encrypt(String data, Key key) throws NoSuchAlgorithmException, NoSuchProviderException,
			NoSuchPaddingException, InvalidKeyException, InvalidAlgorithmParameterException, IllegalBlockSizeException,
			BadPaddingException
	{
		/**
		 * @data - the String data which needed to be encrypted
		 * 
		 * @key - AES key used to encrypt the data This method gets utf8 encoded string data and returns byte array of
		 *      the encrypted data
		 */

		Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding", "BC");
		cipher.init(Cipher.ENCRYPT_MODE, key, new IvParameterSpec(key.getEncoded()));
		return cipher.doFinal(data.getBytes());

	}

	/**
	 * Decrypt the cipher text
	 * 
	 * @param cipherText
	 * @param key
	 * @return string
	 * @throws NoSuchAlgorithmException
	 * @throws NoSuchProviderException
	 * @throws NoSuchPaddingException
	 * @throws InvalidKeyException
	 * @throws InvalidAlgorithmParameterException
	 * @throws IllegalBlockSizeException
	 * @throws BadPaddingException
	 * @see com.intellectdesign.canvas.servercomm.encryption.EncryptionEngine#decrypt(byte[], java.security.Key)
	 */
	@Override
	public String decrypt(byte[] cipherText, Key key) throws NoSuchAlgorithmException, NoSuchProviderException,
			NoSuchPaddingException, InvalidKeyException, InvalidAlgorithmParameterException, IllegalBlockSizeException,
			BadPaddingException
	{
		/**
		 * @cipherText - the cipher message which needs to be decrypted
		 * 
		 * @key - AES key used to encrypt the data This method gets byte array of the cipher and returns utf8 encoded
		 *      plain text string
		 */

		Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding", "BC");
		cipher.init(Cipher.DECRYPT_MODE, key, new IvParameterSpec(key.getEncoded()));
		return new String(cipher.doFinal(cipherText));
	}

	/**
	 * AES key This method gets the hexadecimal String of the key and returns key object
	 * 
	 * @param key
	 * @return key
	 * @throws UnsupportedEncodingException
	 * @throws DecoderException
	 * @see com.intellectdesign.canvas.servercomm.encryption.EncryptionEngine#getKeyFromString(java.lang.String)
	 */
	@Override
	public Key getKeyFromString(String key) throws UnsupportedEncodingException, DecoderException
	{
		/**
		 * @key - AES key This method gets the hexadecimal String of the key and returns key object
		 */
		SecretKeySpec keySpec = EncryptionUtils.getAESKeyFromHexString(key);
		return keySpec;
	}

}
