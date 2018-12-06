/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
 * 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.
 */

package com.intellectdesign.canvas.servercomm.encryption;

import java.io.File;
import java.io.FileInputStream;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.KeyStore;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.cert.Certificate;
import java.security.interfaces.RSAPublicKey;

import javax.crypto.Cipher;

import com.intellectdesign.canvas.logger.Logger;

/**
 * The Enum class which is responsible for creating RSA Instance.
 * 
 * @version 1.0
 */
public enum RSAInstance
{

	INSTANCE ;

	private transient boolean isKeysPresent = Boolean.FALSE;
	private static PublicKey publicKey;
	private static PrivateKey privateKey;
	private static KeyPair keyPair = null;

	private static int length = 1024;

	private static final String alias = "tomcat";
	private static final char[] keyPass = "changeit".toCharArray();

	/**
	 * get the public key
	 * 
	 * @return public key
	 */
	public PublicKey getPublicKey()
	{

		synchronized (PublicKey.class)
		{

			if (!isKeysPresent)
			{

				try
				{
					generateKeys(length);
				} catch (Exception e)
				{
					logger.cterror("CTRND00413", e);
				}
			}
		}
		logger.ctdebug("CTRND00421", publicKey);
		logger.ctdebug("CTRND00422", privateKey);
		return publicKey;
	}

	/**
	 * get the public key certificate
	 * 
	 * @return Certificate
	 * @throws Exception
	 */
	public Certificate getPublicKeyCert() throws Exception
	{

		synchronized (PublicKey.class)
		{

			if (!isKeysPresent)
			{

				try
				{
					generateKeys(length);
				} catch (Exception e)
				{
					logger.cterror("CTRND00414", e);
				}
			}
		}

		KeyStore keyStore = null;

		keyStore = readKeyStore();

		Certificate cert = keyStore.getCertificate(alias);

		return cert;
	}

	/**
	 * Read from keystore
	 * 
	 * @return KeyStore
	 * @throws Exception
	 */
	private KeyStore readKeyStore() throws Exception
	{

		KeyStore caKs = KeyStore.getInstance("JKS");
		caKs.load(new FileInputStream(new File(".keystore")), keyPass);

		return caKs;
	}

	/**
	 * create keys and persist it in memory
	 * 
	 * @param keySize
	 * @throws Exception
	 */
	private void generateKeys(int keySize) throws Exception
	{

		try
		{
			final KeyPairGenerator keyGen = KeyPairGenerator.getInstance("RSA");
			keyGen.initialize(keySize);
			this.keyPair = keyGen.generateKeyPair();

			// Saving the keys to memory

			isKeysPresent = Boolean.TRUE;
		} catch (Exception e)
		{
			logger.cterror("CTRND00415", e);
		}

	}

	/**
	 * get the key modulus
	 * 
	 * @return string
	 * @exception Exception
	 */
	public String getKeyModulus()
	{
		if (!isKeysPresent)
		{

			try
			{
				generateKeys(length);
			} catch (Exception e)
			{
				logger.cterror("CTRND00416", e);
			}
		}
		RSAPublicKey publicKey = (RSAPublicKey) this.keyPair.getPublic();
		return publicKey.getModulus().toString(16);
	}

	/**
	 * get public exponent
	 * 
	 * @return string
	 * @exception Exception
	 */
	public String getPublicExponent()
	{

		if (!isKeysPresent)
		{

			try
			{
				generateKeys(length);
			} catch (Exception e)
			{
				logger.cterror("CTRND00417", e);
			}
		}
		RSAPublicKey publicKey = (RSAPublicKey) this.keyPair.getPublic();
		return publicKey.getPublicExponent().toString(16);
	}

	/**
	 * get the maximum digits
	 * 
	 * @return int
	 */
	public int getMaxDigits()
	{
		return (length * 2 / 16 + 3);
	}

	/**
	 * get the key pair
	 * 
	 * @return keypair
	 */
	public KeyPair getKeyPair()
	{
		if (!isKeysPresent)
		{

			try
			{
				generateKeys(length);
			} catch (Exception e)
			{
				logger.cterror("CTRND00418", e);
			}
		}
		return this.keyPair;
	}

	/**
	 * decrypt the text using the private key
	 * 
	 * @param text
	 * @param key
	 * @return string
	 */
	public static String decrypt(byte[] text, PrivateKey key)
	{
		byte[] dectyptedText = null;
		try
		{
			// get an RSA cipher object and print the provider
			final Cipher cipher = Cipher.getInstance("RSA");

			// decrypt the text using the private key
			cipher.init(Cipher.DECRYPT_MODE, key);
			dectyptedText = cipher.doFinal(text);

		} catch (Exception ex)
		{
			logger.cterror("CTRND00419", ex);
		}

		return new String(dectyptedText);
	}

	private static final Logger logger = Logger.getLogger(RSAInstance.class);
}
