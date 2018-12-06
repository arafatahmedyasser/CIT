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

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;

import org.apache.commons.codec.DecoderException;

/**
 * interface for encryption implementations String datatype is used to avoid concurrency issues, for performance issues
 * String can be replaced after careful validations
 * 
 * @version 1.0
 */
public interface EncryptionEngine
{

	/**
	 * interface for encryption implementations String datatype is used to avoid concurrency issues, for performance
	 * issues String can be replaced after careful validations
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
	 */
	public byte[] encrypt(String data, Key key) throws NoSuchAlgorithmException, NoSuchProviderException,
			NoSuchPaddingException, InvalidKeyException, InvalidAlgorithmParameterException, IllegalBlockSizeException,
			BadPaddingException;

	/**
	 * @data - String value of the data to be encrypted
	 * 
	 * @key - Key used for ecnrypting the data Method for encrypting the data with the key provided
	 */
	/**
	 * Decrypt the cipher text
	 * 
	 * @param cipherText
	 * @param key
	 * @return String
	 * @throws NoSuchAlgorithmException
	 * @throws NoSuchProviderException
	 * @throws NoSuchPaddingException
	 * @throws InvalidKeyException
	 * @throws InvalidAlgorithmParameterException
	 * @throws IllegalBlockSizeException
	 * @throws BadPaddingException
	 */
	public String decrypt(byte[] cipherText, Key key) throws NoSuchAlgorithmException, NoSuchProviderException,
			NoSuchPaddingException, InvalidKeyException, InvalidAlgorithmParameterException, IllegalBlockSizeException,
			BadPaddingException;

	/**
	 * @cipherText - byte array of the encypted data
	 * 
	 * @key- Key used to decrypt the data Method for decrypting the data with the key provided
	 */
	/**
	 * Hexadecimal string value of the key Method for retrieving the key object from the string provided
	 * 
	 * @param key
	 * @return key
	 * @throws UnsupportedEncodingException
	 * @throws DecoderException
	 */
	public Key getKeyFromString(String key) throws UnsupportedEncodingException, DecoderException;
	/**
	 * @key - Hexadecimal string value of the key Method for retrieving the key object from the string provided
	 */
}
