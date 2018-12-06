/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.
 **/
package com.intellectdesign.canvas.validator.locale;

/**
 * This class is for  This character set provides the support for validation against SWIFT compliant characters. The SWIFT compliant
 * characters are applicable across all language codes and hence is treated as a special character set it itself
 * 
 * @version 1.0
 */
public class SwiftCharacterSet extends ValidCharacterSet
{
	/**
	 * Internal constant for serialization purposes
	 */
	// The source for the codepage data is:
	// http://www.unicode.org
	// character array containing the entire characters for Valid swift characters
	public static final char[] characters =
	{ 0x000A, // ;LINE FEED;
			0x000D, // ;CARRIAGE RETURN;
			0x0020, // ;SPACE;
			0x0027, // ;APOSTROPHE;
			0x0028, // ;LEFT PARENTHESIS;
			0x0029, // ;RIGHT PARENTHESIS;
			0x002B, // ;PLUS SIGN;
			0x002C, // ;COMMA;
			0x002D, // ;HYPHEN-MINUS;
			0x002E, // ;FULL STOP;
			0x002F, // ;SOLIDUS;
			0x0030, // ;DIGIT ZERO;Nd;0;EN;;0;0;0;N;;;;;
			0x0031, // ;DIGIT ONE;Nd;0;EN;;1;1;1;N;;;;;
			0x0032, // ;DIGIT TWO;Nd;0;EN;;2;2;2;N;;;;;
			0x0033, // ;DIGIT THREE;Nd;0;EN;;3;3;3;N;;;;;
			0x0034, // ;DIGIT FOUR;Nd;0;EN;;4;4;4;N;;;;;
			0x0035, // ;DIGIT FIVE;Nd;0;EN;;5;5;5;N;;;;;
			0x0036, // ;DIGIT SIX;Nd;0;EN;;6;6;6;N;;;;;
			0x0037, // ;DIGIT SEVEN;Nd;0;EN;;7;7;7;N;;;;;
			0x0038, // ;DIGIT EIGHT;Nd;0;EN;;8;8;8;N;;;;;
			0x0039, // ;DIGIT NINE;Nd;0;EN;;9;9;9;N;;;;;
			0X003A, // ;COLON;
			0X003F, // ;QUESTION MARK;
			0x0041, // ;LATIN CAPITAL LETTER A;Lu;0;L;;;;;N;;;;0061;
			0x0042, // ;LATIN CAPITAL LETTER B;Lu;0;L;;;;;N;;;;0062;
			0x0043, // ;LATIN CAPITAL LETTER C;Lu;0;L;;;;;N;;;;0063;
			0x0044, // ;LATIN CAPITAL LETTER D;Lu;0;L;;;;;N;;;;0064;
			0x0045, // ;LATIN CAPITAL LETTER E;Lu;0;L;;;;;N;;;;0065;
			0x0046, // ;LATIN CAPITAL LETTER F;Lu;0;L;;;;;N;;;;0066;
			0x0047, // ;LATIN CAPITAL LETTER G;Lu;0;L;;;;;N;;;;0067;
			0x0048, // ;LATIN CAPITAL LETTER H;Lu;0;L;;;;;N;;;;0068;
			0x0049, // ;LATIN CAPITAL LETTER I;Lu;0;L;;;;;N;;;;0069;
			0x004A, // ;LATIN CAPITAL LETTER J;Lu;0;L;;;;;N;;;;006A;
			0x004B, // ;LATIN CAPITAL LETTER K;Lu;0;L;;;;;N;;;;006B;
			0x004C, // ;LATIN CAPITAL LETTER L;Lu;0;L;;;;;N;;;;006C;
			0x004D, // ;LATIN CAPITAL LETTER M;Lu;0;L;;;;;N;;;;006D;
			0x004E, // ;LATIN CAPITAL LETTER N;Lu;0;L;;;;;N;;;;006E;
			0x004F, // ;LATIN CAPITAL LETTER O;Lu;0;L;;;;;N;;;;006F;
			0x0050, // ;LATIN CAPITAL LETTER P;Lu;0;L;;;;;N;;;;0070;
			0x0051, // ;LATIN CAPITAL LETTER Q;Lu;0;L;;;;;N;;;;0071;
			0x0052, // ;LATIN CAPITAL LETTER R;Lu;0;L;;;;;N;;;;0072;
			0x0053, // ;LATIN CAPITAL LETTER S;Lu;0;L;;;;;N;;;;0073;
			0x0054, // ;LATIN CAPITAL LETTER T;Lu;0;L;;;;;N;;;;0074;
			0x0055, // ;LATIN CAPITAL LETTER U;Lu;0;L;;;;;N;;;;0075;
			0x0056, // ;LATIN CAPITAL LETTER V;Lu;0;L;;;;;N;;;;0076;
			0x0057, // ;LATIN CAPITAL LETTER W;Lu;0;L;;;;;N;;;;0077;
			0x0058, // ;LATIN CAPITAL LETTER X;Lu;0;L;;;;;N;;;;0078;
			0x0059, // ;LATIN CAPITAL LETTER Y;Lu;0;L;;;;;N;;;;0079;
			0x005A, // ;LATIN CAPITAL LETTER Z;Lu;0;L;;;;;N;;;;007A;
			0x0061, // ;LATIN SMALL LETTER A;Ll;0;L;;;;;N;;;0041;;0041
			0x0062, // ;LATIN SMALL LETTER B;Ll;0;L;;;;;N;;;0042;;0042
			0x0063, // ;LATIN SMALL LETTER C;Ll;0;L;;;;;N;;;0043;;0043
			0x0064, // ;LATIN SMALL LETTER D;Ll;0;L;;;;;N;;;0044;;0044
			0x0065, // ;LATIN SMALL LETTER E;Ll;0;L;;;;;N;;;0045;;0045
			0x0066, // ;LATIN SMALL LETTER F;Ll;0;L;;;;;N;;;0046;;0046
			0x0067, // ;LATIN SMALL LETTER G;Ll;0;L;;;;;N;;;0047;;0047
			0x0068, // ;LATIN SMALL LETTER H;Ll;0;L;;;;;N;;;0048;;0048
			0x0069, // ;LATIN SMALL LETTER I;Ll;0;L;;;;;N;;;0049;;0049
			0x006A, // ;LATIN SMALL LETTER J;Ll;0;L;;;;;N;;;004A;;004A
			0x006B, // ;LATIN SMALL LETTER K;Ll;0;L;;;;;N;;;004B;;004B
			0x006C, // ;LATIN SMALL LETTER L;Ll;0;L;;;;;N;;;004C;;004C
			0x006D, // ;LATIN SMALL LETTER M;Ll;0;L;;;;;N;;;004D;;004D
			0x006E, // ;LATIN SMALL LETTER N;Ll;0;L;;;;;N;;;004E;;004E
			0x006F, // ;LATIN SMALL LETTER O;Ll;0;L;;;;;N;;;004F;;004F
			0x0070, // ;LATIN SMALL LETTER P;Ll;0;L;;;;;N;;;0050;;0050
			0x0071, // ;LATIN SMALL LETTER Q;Ll;0;L;;;;;N;;;0051;;0051
			0x0072, // ;LATIN SMALL LETTER R;Ll;0;L;;;;;N;;;0052;;0052
			0x0073, // ;LATIN SMALL LETTER S;Ll;0;L;;;;;N;;;0053;;0053
			0x0074, // ;LATIN SMALL LETTER T;Ll;0;L;;;;;N;;;0054;;0054
			0x0075, // ;LATIN SMALL LETTER U;Ll;0;L;;;;;N;;;0055;;0055
			0x0076, // ;LATIN SMALL LETTER V;Ll;0;L;;;;;N;;;0056;;0056
			0x0077, // ;LATIN SMALL LETTER W;Ll;0;L;;;;;N;;;0057;;0057
			0x0078, // ;LATIN SMALL LETTER X;Ll;0;L;;;;;N;;;0058;;0058
			0x0079, // ;LATIN SMALL LETTER Y;Ll;0;L;;;;;N;;;0059;;0059
			0x007A // ;LATIN SMALL LETTER Z;Ll;0;L;;;;;N;;;005A;;005A
	};
	// character array containing the special characters that do not apply for text fields.
	public static final char[] specialcharacters =
	{ 0x000A, // ;LINE FEED;
			0x000D, // ;CARRIAGE RETURN;
			0x000A, // ;LINE FEED;
			0x000D, // ;CARRIAGE RETURN;
			0x0020, // ;SPACE;
			0x0027, // ;APOSTROPHE;
			0x0028, // ;LEFT PARENTHESIS;
			0x0029, // ;RIGHT PARENTHESIS;
			0x002B, // ;PLUS SIGN;
			0x002C, // ;COMMA;
			0x002D, // ;HYPHEN-MINUS;
			0x002E, // ;FULL STOP;
			0x002F, // ;SOLIDUS;
			0x0030, // ;DIGIT ZERO;Nd;0;EN;;0;0;0;N;;;;;
			0x0031, // ;DIGIT ONE;Nd;0;EN;;1;1;1;N;;;;;
			0x0032, // ;DIGIT TWO;Nd;0;EN;;2;2;2;N;;;;;
			0x0033, // ;DIGIT THREE;Nd;0;EN;;3;3;3;N;;;;;
			0x0034, // ;DIGIT FOUR;Nd;0;EN;;4;4;4;N;;;;;
			0x0035, // ;DIGIT FIVE;Nd;0;EN;;5;5;5;N;;;;;
			0x0036, // ;DIGIT SIX;Nd;0;EN;;6;6;6;N;;;;;
			0x0037, // ;DIGIT SEVEN;Nd;0;EN;;7;7;7;N;;;;;
			0x0038, // ;DIGIT EIGHT;Nd;0;EN;;8;8;8;N;;;;;
			0x0039, // ;DIGIT NINE;Nd;0;EN;;9;9;9;N;;;;;
			0X003A, // ;COLON;
			0X003F, // ;QUESTION MARK;
			0x0041, // ;LATIN CAPITAL LETTER A;Lu;0;L;;;;;N;;;;0061;
			0x0042, // ;LATIN CAPITAL LETTER B;Lu;0;L;;;;;N;;;;0062;
			0x0043, // ;LATIN CAPITAL LETTER C;Lu;0;L;;;;;N;;;;0063;
			0x0044, // ;LATIN CAPITAL LETTER D;Lu;0;L;;;;;N;;;;0064;
			0x0045, // ;LATIN CAPITAL LETTER E;Lu;0;L;;;;;N;;;;0065;
			0x0046, // ;LATIN CAPITAL LETTER F;Lu;0;L;;;;;N;;;;0066;
			0x0047, // ;LATIN CAPITAL LETTER G;Lu;0;L;;;;;N;;;;0067;
			0x0048, // ;LATIN CAPITAL LETTER H;Lu;0;L;;;;;N;;;;0068;
			0x0049, // ;LATIN CAPITAL LETTER I;Lu;0;L;;;;;N;;;;0069;
			0x004A, // ;LATIN CAPITAL LETTER J;Lu;0;L;;;;;N;;;;006A;
			0x004B, // ;LATIN CAPITAL LETTER K;Lu;0;L;;;;;N;;;;006B;
			0x004C, // ;LATIN CAPITAL LETTER L;Lu;0;L;;;;;N;;;;006C;
			0x004D, // ;LATIN CAPITAL LETTER M;Lu;0;L;;;;;N;;;;006D;
			0x004E, // ;LATIN CAPITAL LETTER N;Lu;0;L;;;;;N;;;;006E;
			0x004F, // ;LATIN CAPITAL LETTER O;Lu;0;L;;;;;N;;;;006F;
			0x0050, // ;LATIN CAPITAL LETTER P;Lu;0;L;;;;;N;;;;0070;
			0x0051, // ;LATIN CAPITAL LETTER Q;Lu;0;L;;;;;N;;;;0071;
			0x0052, // ;LATIN CAPITAL LETTER R;Lu;0;L;;;;;N;;;;0072;
			0x0053, // ;LATIN CAPITAL LETTER S;Lu;0;L;;;;;N;;;;0073;
			0x0054, // ;LATIN CAPITAL LETTER T;Lu;0;L;;;;;N;;;;0074;
			0x0055, // ;LATIN CAPITAL LETTER U;Lu;0;L;;;;;N;;;;0075;
			0x0056, // ;LATIN CAPITAL LETTER V;Lu;0;L;;;;;N;;;;0076;
			0x0057, // ;LATIN CAPITAL LETTER W;Lu;0;L;;;;;N;;;;0077;
			0x0058, // ;LATIN CAPITAL LETTER X;Lu;0;L;;;;;N;;;;0078;
			0x0059, // ;LATIN CAPITAL LETTER Y;Lu;0;L;;;;;N;;;;0079;
			0x005A, // ;LATIN CAPITAL LETTER Z;Lu;0;L;;;;;N;;;;007A;
			0x0061, // ;LATIN SMALL LETTER A;Ll;0;L;;;;;N;;;0041;;0041
			0x0062, // ;LATIN SMALL LETTER B;Ll;0;L;;;;;N;;;0042;;0042
			0x0063, // ;LATIN SMALL LETTER C;Ll;0;L;;;;;N;;;0043;;0043
			0x0064, // ;LATIN SMALL LETTER D;Ll;0;L;;;;;N;;;0044;;0044
			0x0065, // ;LATIN SMALL LETTER E;Ll;0;L;;;;;N;;;0045;;0045
			0x0066, // ;LATIN SMALL LETTER F;Ll;0;L;;;;;N;;;0046;;0046
			0x0067, // ;LATIN SMALL LETTER G;Ll;0;L;;;;;N;;;0047;;0047
			0x0068, // ;LATIN SMALL LETTER H;Ll;0;L;;;;;N;;;0048;;0048
			0x0069, // ;LATIN SMALL LETTER I;Ll;0;L;;;;;N;;;0049;;0049
			0x006A, // ;LATIN SMALL LETTER J;Ll;0;L;;;;;N;;;004A;;004A
			0x006B, // ;LATIN SMALL LETTER K;Ll;0;L;;;;;N;;;004B;;004B
			0x006C, // ;LATIN SMALL LETTER L;Ll;0;L;;;;;N;;;004C;;004C
			0x006D, // ;LATIN SMALL LETTER M;Ll;0;L;;;;;N;;;004D;;004D
			0x006E, // ;LATIN SMALL LETTER N;Ll;0;L;;;;;N;;;004E;;004E
			0x006F, // ;LATIN SMALL LETTER O;Ll;0;L;;;;;N;;;004F;;004F
			0x0070, // ;LATIN SMALL LETTER P;Ll;0;L;;;;;N;;;0050;;0050
			0x0071, // ;LATIN SMALL LETTER Q;Ll;0;L;;;;;N;;;0051;;0051
			0x0072, // ;LATIN SMALL LETTER R;Ll;0;L;;;;;N;;;0052;;0052
			0x0073, // ;LATIN SMALL LETTER S;Ll;0;L;;;;;N;;;0053;;0053
			0x0074, // ;LATIN SMALL LETTER T;Ll;0;L;;;;;N;;;0054;;0054
			0x0075, // ;LATIN SMALL LETTER U;Ll;0;L;;;;;N;;;0055;;0055
			0x0076, // ;LATIN SMALL LETTER V;Ll;0;L;;;;;N;;;0056;;0056
			0x0077, // ;LATIN SMALL LETTER W;Ll;0;L;;;;;N;;;0057;;0057
			0x0078, // ;LATIN SMALL LETTER X;Ll;0;L;;;;;N;;;0058;;0058
			0x0079, // ;LATIN SMALL LETTER Y;Ll;0;L;;;;;N;;;0059;;0059
			0x007A // ;LATIN SMALL LETTER Z;Ll;0;L;;;;;N;;;005A;;005A
	};

	/**
	 * Default constructor. Nothing done here
	 */
	public SwiftCharacterSet()
	{
	}

	/**
	 * This is interpreted as the SWIFT character set with optional CR LF also to be included. To be used where ever
	 * there is a multi line text evaluation needed
	 * 
	 * @see com.intellectdesign.canvas.validator.locale.ValidCharacterSet#alphaNumericCharSet()
	 */
	@Override
	protected char[] alphaNumericCharSet()
	{
		return specialcharacters;
	}

	/**
	 * This is interpreted as a field that can accept SWIFT characters without any CR LF.
	 * 
	 * @see com.intellectdesign.canvas.validator.locale.ValidCharacterSet#alphaCharSet()
	 */
	@Override
	protected char[] alphaCharSet()
	{
		return characters;
	}

	/**
	 * this character set has to be applied in totality and no concept of SWIFT alpha only, etc.
	 * 
	 * @see com.intellectdesign.canvas.validator.locale.ValidCharacterSet#numericCharSet()
	 */
	@Override
	protected char[] numericCharSet()
	{
		return BLANK_CHARACTER_SET;
	}

}
