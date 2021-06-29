#------------------------------------------------------------------------
# Created by:  Brady, Betsy
#              eabrady
#              4 December 2019 
#
# Assignment:  Lab 5: Subroutines
#              CSE 12, Computer Systems and Assembly Language
#              UC Santa Cruz, Fall 2019
# 
# Description: Library of subroutines used to convert an array of
#              numerical ASCII strings to ints, sort them, and print
#              them.
# 
# Notes:       This file is intended to be run from the Lab 5 test file.
#------------------------------------------------------------------------

.text

j  exit_program                # prevents this file from running
                               # independently (do not remove)

#------------------------------------------------------------------------
# MACROS
#------------------------------------------------------------------------

#------------------------------------------------------------------------
# print new line macro

.macro lab5_print_new_line
    addiu $v0 $zero   11
    addiu $a0 $zero   0xA
    syscall
.end_macro

#------------------------------------------------------------------------
# print string

.macro lab5_print_string(%str)

    .data
    string: .asciiz %str

    .text
    li  $v0 4
    la  $a0 string
    syscall
    
.end_macro

#------------------------------------------------------------------------
# add additional macros here


#------------------------------------------------------------------------
# main_function_lab5_19q4_fa_ce12:
#
# Calls print_str_array, str_to_int_array, sort_array,
# print_decimal_array.
#
# You may assume that the array of string pointers is terminated by a
# 32-bit zero value. You may also assume that the integer array is large
# enough to hold each converted integer value and is terminated by a
# 32-bit zero value
# 
# arguments:  $a0 - pointer to integer array
#
#             $a1 - double pointer to string array (pointer to array of
#                   addresses that point to the first characters of each
#                   string in array)
#
# returns:    $v0 - minimum element in array (32-bit int)
#             $v1 - maximum element in array (32-bit int)
#-----------------------------------------------------------------------
# REGISTER USE
# $s0 - pointer to int array
# $s1 - double pointer to string array
# $s2 - length of array
#-----------------------------------------------------------------------

.text
main_function_lab5_19q4_fa_ce12: nop
    
    subi  $sp    $sp   16       # decrement stack pointer
    sw    $ra 12($sp)           # push return address to stack
    sw    $s0  8($sp)           # push save registers to stack
    sw    $s1  4($sp)
    sw    $s2   ($sp)
    
    move  $s0    $a0            # save ptr to int array
    move  $s1    $a1            # save ptr to string array
    
    move  $a0    $s1            # load subroutine arguments
    jal   get_array_length      # determine length of array
    move  $s2    $v0            # save array length
    move $a0, $s0
                                # print input header
                                 
    lab5_print_string("\n----------------------------------------")
    lab5_print_string("\nInput string array\n")
                       
    ########################### # add code (delete this comment)
    move $a1, $s1               # load subroutine arguments
    jal   print_str_array       # print array of ASCII strings
        move $a0, $s0
    
    
    ########################### # add code (delete this comment)
    move $a0, $s1               # load subroutine arguments
    move $a2, $s0 #str_int_array
    
    jal   str_to_int_array      # convert string array to int array
        move $a0, $s0
                                    
    ########################### # add code (delete this comment)
    move $a1, $s0 #str_int_array       # load subroutine arguments
    jal   sort_array            # sort int array
    subi  $sp    $sp   8       # decrement stack pointer
    sw    $v0  4($sp)          
    sw    $v1  0($sp)          # save min and max values from array
    move $a0, $s0
                                # print output header    
    lab5_print_new_line
    lab5_print_string("\n----------------------------------------")
    lab5_print_string("\nSorted integer array\n")
    
    ########################### # add code (delete this comment)
    move $a1, $s0 #str_int_array       # load subroutine arguments
    jal   print_decimal_array   # print integer array as decimal
                                # save output values
        move $a0, $s0
    lab5_print_new_line
    
    ########################### # add code (delete this comment)
    lw $v0 4($sp)
    lw $v1 0($sp)
    addi $sp, $sp, 8            # move min and max values from array
                                # to output registers
                                
    move $a0, $s0
                                
            
    lw    $ra 12($sp)           # pop return address from stack
    lw    $s0  8($sp)           # pop save registers from stack
    lw    $s1  4($sp)
    lw    $s2   ($sp)
    addi  $sp    $sp   16       # increment stack pointer
    
    jr    $ra                   # return from subroutine

    
    
.data
	array_alignment: .align 2
	str_int_array: .space 16

#-----------------------------------------------------------------------
# print_str_array	
#
# Prints array of ASCII inputs to screen.
#
# arguments:  $a0 - array length (optional)
# 
#             $a1 - double pointer to string array (pointer to array of
#                   addresses that point to the first characters of each
#                   string in array)
#
# returns:    n/a
#-----------------------------------------------------------------------
# REGISTER USE
# $v0 - which syscall to use
# $a0 - arguments for syscall
# $a1 - double pointer to string array
#-----------------------------------------------------------------------

.text
print_str_array: nop

	subiu $sp, $sp, 4
	sw $a0, 0($sp)

	#Print first program argument
	li $v0, 4
	lw $a0, 0($a1)
	syscall
	
	#Space
	li $v0, 11
	la $a0, 0x20
	syscall
	
	#Print second program argument
	li $v0, 4
	lw $a0, 4($a1)
	syscall
	
	#Space
	li $v0, 11
	la $a0, 0x20
	syscall
	
	#Print third program argument
	li $v0, 4
	lw $a0, 8($a1)
	syscall
	
	lw $a0, 0($sp)
	addiu $sp, $sp, 4

    jr  $ra
    
#-----------------------------------------------------------------------
# str_to_int_array
#
# Converts array of ASCII strings to array of integers in same order as
# input array. Strings will be in the following format: '0xABCDEF00'
# 
# i.e zero, lowercase x, followed by 8 hexadecimal digits, with A - F
# capitalized
# 
# arguments:  $a0 - array length (optional)
#
#             $a1 - double pointer to string array (pointer to array of
#                   addresses that point to the first characters of each
#                   string in array)
#
#             $a2 - pointer to integer array
#
# returns:    n/a
#-----------------------------------------------------------------------
# REGISTER USE
# $a0 - arguments for str_to_int
# $a1 - double pointer to string array
# $a2 - address of array
# $v0 - results to save from str_to_int
#-----------------------------------------------------------------------

.text
str_to_int_array: nop
    
    subiu $sp, $sp, 4
    sw $ra, 0($sp)
    subiu $sp, $sp, 4
    sw $a0, 0($sp)
 
	
	#Save first PA
	lw $a0, 0($a1)
	jal str_to_int
	sw $v0, 0($a2)
	
	#Save second PA
	lw $a0, 4($a1)
	jal str_to_int
	sw $v0, 4($a2)
	
	#Save third PA
	lw $a0, 8($a1)
	jal str_to_int
	sw $v0, 8($a2)
	
    
    lw $a0, 0($sp)
    addiu $sp, $sp, 4
    lw $ra, 0($sp)
    addiu $sp, $sp, 4
    
    jr   $ra


#-----------------------------------------------------------------------
# str_to_int	
#
# Converts ASCII string to integer. Strings will be in the following
# format: '0xABCDEF00'
# 
# i.e zero, lowercase x, followed by 8 hexadecimal digits, capitalizing
# A - F.
# 
# argument:   $a0 - pointer to first character of ASCII string
#
# returns:    $v0 - integer conversion of input string
#-----------------------------------------------------------------------
# REGISTER USE
# $a0 - pointer to first character of ASCII string
# $v0 - inter conversion of input string
# $t0 - loop counter
# $t1-$t8 - bytes of integer
#-----------------------------------------------------------------------

.text
str_to_int: nop

    #First byte
	lb $t8, 2($a0)
	li $t0, 1
	j combBytes
    #Second byte
	byte2: nop
	move $t1, $t8
	sll $t1, $t1, 28
	lb $t8, 3($a0)
	j combBytes
    #Third byte
	byte3: nop
	move $t2, $t8
	sll $t2, $t2, 24
	lb $t8, 4($a0)
	j combBytes
    #Fourth byte
	byte4: nop
	move $t3, $t8
	sll $t3, $t3, 20
	lb $t8, 5($a0)
	j combBytes
    #Fifth byte
	byte5: nop
	move $t4, $t8
	sll $t4, $t4, 16
	lb $t8, 6($a0)
	j combBytes
    #Sixth byte
	byte6: nop
	move $t5, $t8
	sll $t5, $t5, 12
	lb $t8, 7($a0)
	j combBytes
    #Seventh byte
	byte7: nop
	move $t6, $t8
	sll $t6, $t6, 8
	lb $t8, 8($a0)
	j combBytes
    #Eighth byte
	byte8: nop
	move $t7, $t8
	sll $t7, $t7, 4
	lb $t8, 9($a0)
    #Checking if byte is hex or integer
	combBytes: nop
	bgt $t8, 64, hex
	subi $t8, $t8, 48
	j byteCheck
	hex: nop
	subi $t8, $t8, 55
    #Branching for correct byte
	byteCheck: nop
	addi $t0, $t0, 1
	beq $t0, 2 byte2
	beq $t0, 3 byte3
	beq $t0, 4 byte4
	beq $t0, 5 byte5
	beq $t0, 6 byte6
	beq $t0, 7 byte7
	beq $t0, 8 byte8
	or $v0, $t1, $t2
	or $v0, $v0, $t3
	or $v0, $v0, $t4
	or $v0, $v0, $t5
	or $v0, $v0, $t6
	or $v0, $v0, $t7
	or $v0, $v0, $t8
	
    jr   $ra
    
#-----------------------------------------------------------------------
# sort_array
#
# Sorts an array of integers in ascending numerical order, with the
# minimum value at the lowest memory address. Assume integers are in
# 32-bit two's complement notation.
#
# arguments:  $a0 - array length (optional)
#             $a1 - pointer to first element of array
#
# returns:    $v0 - minimum element in array
#             $v1 - maximum element in array
#-----------------------------------------------------------------------
# REGISTER USE
# $a1 - pointer to first element of array
# $t1 - first program argument
# $t2 - second program argument
# $t3 - third program argument
# $t4 - middle array element
# $v0 - minimum element in array
# $v1 - maximum element in array
#-----------------------------------------------------------------------

.text
sort_array: nop
#Put PAs in temp registers
lw $t1, 0($a1)
lw $t2, 4($a1)
lw $t3, 8($a1)

sortInts: nop
bgt $t1, $t2, PA1GreatCheck
bgt $t2, $t3, apPA2Great
PA3GreatCheck: nop
bgt $t3, $t2, apPA3Great

PA1GreatCheck: nop
bgt $t1, $t3, apPA1Great
j PA3GreatCheck

	#PA1 Greatest
	apPA1Great: nop
	move $v1, $t1
	bgt $t2, $t3, ap1PA2Mid
	j ap1PA3Mid
		#PA2 Middle
		ap1PA2Mid: nop
		move $t4, $t2
		move $v0, $t3
		j save_sorted_array
		#PA3 Middle
		ap1PA3Mid: nop
		move $t4, $t3
		move $v0, $t2
		j save_sorted_array
	#PA2 Greatest
	apPA2Great: nop
	move $v1, $t2
	bgt $t1, $t3, ap2PA1Mid
	j ap2PA3Mid
		#PA1 Middle
		ap2PA1Mid: nop
		move $t4, $t1
		move $v0, $t3
		j save_sorted_array
		#PA3 Middle
		ap2PA3Mid: nop
		move $t4, $t3
		move $v0, $t1
		j save_sorted_array
	#PA3 Greatest
	apPA3Great: nop
	move $v1, $t3
	bgt $t1, $t2, ap3PA1Mid
	j ap3PA2Mid
		#PA1 Middle
		ap3PA1Mid: nop
		move $t4, $t1
		move $v0, $t2
		j save_sorted_array
		#PA2 Middle
		ap3PA2Mid: nop
		move $t4, $t2
		move $v0, $t1
		j save_sorted_array


	#Save sorted PAs in array
	save_sorted_array: nop
	
	#Save first PA
	sw $v0, 0($a1)
	
	#Save second PA
	sw $t4, 4($a1)
	
	#Save third PA
	sw $v1, 8($a1)

    jr   $ra

#-----------------------------------------------------------------------
# print_decimal_array
#
# Prints integer input array in decimal, with spaces in between each
# element.
#
# arguments:  $a0 - array length (optional)
#             $a1 - pointer to first element of array
#
# returns:    n/a
#-----------------------------------------------------------------------
# REGISTER USE
# $a0 - array length
# $a1 - pointer to first element of array
#-----------------------------------------------------------------------

.text
print_decimal_array: nop

    subiu $sp, $sp, 4
    sw $ra, 0($sp)
    subiu $sp, $sp, 4
    sw $a0, 0($sp)
 
	
	#Print first PA
	lw $a0, 0($a1)
	jal print_decimal
	
		
	#Space
	li $v0, 11
	la $a0, 0x20
	syscall
	
	#Save second PA
	lw $a0, 4($a1)
	jal print_decimal
	
	#Space
	li $v0, 11
	la $a0, 0x20
	syscall
	
	#Save third PA
	lw $a0, 8($a1)
	jal print_decimal
	
    
    lw $a0, 0($sp)
    addiu $sp, $sp, 4
    lw $ra, 0($sp)
    addiu $sp, $sp, 4

    jr   $ra
    
#-----------------------------------------------------------------------
# print_decimal
#
# Prints integer in decimal representation.
#
# arguments:  $a0 - integer to print
#
# returns:    n/a
#-----------------------------------------------------------------------
# REGISTER USE
# $a0 - integer to print
# $t0 - number of digits (loop counter)
# $t1 - number to divide by (10)
# $t2 - remainder (digit to save)
# $t3 - quotient (value to divide)
# $t4 - digit ASCII code
# $t5 - value to invert bits with
#-----------------------------------------------------------------------

.text
print_decimal: nop

    li $t1, 10
    li $t0, 0
    li $t5 0xFFFFFFFF
    move $t3, $a0
    
    bge $t3, 0x00000000, divDigits
    invertNegative: nop
    subiu $t3, $t3, 1
    xor $t3, $t3, $t5
    
    #Print negative sign
    li $v0, 11
    li $a0, 0x2D
    syscall
      
    #Isolate digits by dividing by 10
    divDigits: nop
    divu $t3, $t1
    mfhi $t2
    mflo $t3
    subiu $sp, $sp, 4
    sw $t2, 0($sp)		#Save remainder to stack
    addiu $t0, $t0, 1
    
    bgt $t3, 0, divDigits
    
    #Print digits in reverse order from how they were saved
    printDigits: nop
    lw $t4 0($sp)
    addiu $sp, $sp, 4
    addiu $t4, $t4, 0x30 
    
    li $v0, 11
    move $a0, $t4
    syscall
    
    subiu $t0, $t0, 1
    
    bgt $t0, 0, printDigits
    

    jr   $ra

#-----------------------------------------------------------------------
# exit_program (given)
#
# Exits program.
#
# arguments:  n/a
#
# returns:    n/a
#-----------------------------------------------------------------------
# REGISTER USE
# $v0: syscall
#-----------------------------------------------------------------------

.text
exit_program: nop
    
    addiu   $v0  $zero  10      # exit program cleanly
    syscall
    
#-----------------------------------------------------------------------
# OPTIONAL SUBROUTINES
#-----------------------------------------------------------------------
# You are permitted to delete these comments.

#-----------------------------------------------------------------------
# get_array_length (optional)
# 
# Determines number of elements in array.
#
# argument:   $a0 - double pointer to string array (pointer to array of
#                   addresses that point to the first characters of each
#                   string in array)
#
# returns:    $v0 - array length
#-----------------------------------------------------------------------
# REGISTER USE
# 
#-----------------------------------------------------------------------

.text
get_array_length: nop
    
    addiu   $v0  $zero  3       # replace with /code to
                                # determine array length
    jr      $ra
    
#-----------------------------------------------------------------------
# save_to_int_array (optional)
# 
# Saves a 32-bit value to a specific index in an integer array
#
# argument:   $a0 - value to save
#             $a1 - address of int array
#             $a2 - index to save to
#
# returns:    n/a
#-----------------------------------------------------------------------
# REGISTER USE
# 
#-----------------------------------------------------------------------
