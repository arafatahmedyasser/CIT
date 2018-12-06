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
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.codec.DecoderException;

/**
 * Container class to facilitate encryption and decryption of data , This container is used as the controller for the
 * underlying implementation This will also facilitate in storing the key in session
 * 
 * @version 1.0
 */

public class EncryptionContainer
{

	private EncryptionEngine encEngine = null;
	private HttpServletRequest request = null;

	/**
	 * Default constructor which needs the request object and the implementing class
	 * 
	 * @param request
	 * @param engine
	 */

	public EncryptionContainer(HttpServletRequest request, EncryptionEngine engine)
	{
		this.encEngine = engine;
		this.request = request;
	}

	/**
	 * Method to store the secret key used for encryption/decryption in session
	 * 
	 * @param key
	 * @throws UnsupportedEncodingException
	 * @throws DecoderException
	 */
	public void storeKey(String key) throws UnsupportedEncodingException, DecoderException
	{

		Key aesKey = this.encEngine.getKeyFromString(key);
		this.request.getSession().getServletContext().setAttribute("AES_KEY", aesKey);
	}

	/**
	 * * Method to get the secret key used for encryption/decryption in session
	 * 
	 * @return key
	 */
	private Key getKey()
	{

		Key key = (Key) this.request.getSession().getServletContext().getAttribute("AES_KEY");

		return key;
	}

	/**
	 * * Method to encrypt the data with the secret key with the help of the underlying implementation
	 * 
	 * @param data
	 * @return byte[]
	 * @throws InvalidKeyException
	 * @throws NoSuchAlgorithmException
	 * @throws NoSuchProviderException
	 * @throws NoSuchPaddingException
	 * @throws InvalidAlgorithmParameterException
	 * @throws IllegalBlockSizeException
	 * @throws BadPaddingException
	 */
	public byte[] encrypt(String data) throws InvalidKeyException, NoSuchAlgorithmException, NoSuchProviderException,
			NoSuchPaddingException, InvalidAlgorithmParameterException, IllegalBlockSizeException, BadPaddingException
	{

		return this.encEngine.encrypt(data, this.getKey());
	}

	/**
	 * Method to decrypt the data with the secret key used for encryption/decryption with the help of the underlying
	 * implementation
	 * 
	 * @param cipherText
	 * @throws InvalidKeyException
	 * @throws NoSuchAlgorithmException
	 * @throws NoSuchProviderException
	 * @throws NoSuchPaddingException
	 * @throws InvalidAlgorithmParameterException
	 * @throws IllegalBlockSizeException
	 * @throws BadPaddingException
	 */
	public String decrypt(byte[] cipherText) throws InvalidKeyException, NoSuchAlgorithmException,
			NoSuchProviderException, NoSuchPaddingException, InvalidAlgorithmParameterException,
			IllegalBlockSizeException, BadPaddingException
	{
		return this.encEngine.decrypt(cipherText, this.getKey());

	}
}
