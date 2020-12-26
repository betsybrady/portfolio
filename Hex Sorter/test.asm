#------------------------------------------------------------------------
# Created by:  Rebecca
#              23 November 2019
#
# Description: Test code for Lab 5 for CSE 12, Fall 2019
#
# Note:        This program is intended to run in the MARS IDE.
#              Enter test case in the program arguments field in the
#              following formats:
#
#              0xABCDEF00 0XFFFFFFFF 0x00000008
#
#              i.e. zero, lowercase x, followed by 8 hexadecimal digits,
#              with A-F capitalized, spaces between each argument
#------------------------------------------------------------------------

#------------------------------------------------------------------------
# MACROS
#------------------------------------------------------------------------

#------------------------------------------------------------------------
# set_s_vals
# populate s registers
# 
# set values at the top of this test file
#------------------------------------------------------------------------

.data

s0_val: .word 0xc0ffeeee        # used in s reg initialization
s1_val: .word 0xc0ffeeee
s2_val: .word 0xc0ffeeee
s3_val: .word 0xc0ffeeee
s4_val: .word 0xc0ffeeee
s5_val: .word 0xc0ffeeee
s6_val: .word 0xc0ffeeee
s7_val: .word 0xc0ffeeee

.macro set_s_vals

    lw  $s0  s0_val
    lw  $s1  s1_val
    lw  $s2  s2_val
    lw  $s3  s3_val
    lw  $s4  s4_val
    lw  $s5  s5_val
    lw  $s6  s6_val
    lw  $s7  s7_val

.end_macro

#------------------------------------------------------------------------
# push regs used in syscalls so values are not overwritten
#------------------------------------------------------------------------
.macro push_a0_v0

    subi  $sp    $sp   8
    sw    $a0   ($sp)
    sw    $v0  4($sp)

.end_macro

#------------------------------------------------------------------------
# pop regs used in syscalls so values are not overwritten
#------------------------------------------------------------------------
.macro pop_a0_v0

    lw    $a0   ($sp)
    lw    $v0  4($sp)
    addi  $sp    $sp   8

.end_macro

#------------------------------------------------------------------------
# print new line

.macro print_new_line

    push_a0_v0                         # push $a0 and $v0 to stack so
                                       # values are not overwritten
    addiu $v0 $zero   11
    addiu $a0 $zero   0xA
    syscall

    pop_a0_v0                          # pop $a0 and $v0 off stack

.end_macro

#------------------------------------------------------------------------
# print string - prints new line after string

.macro print_str(%str)

    .data
    str_to_print: .asciiz %str

    .text
    push_a0_v0                         # push $a0 and $v0 to stack so
                                       # values are not overwritten
    addiu $v0 $zero   4
    la    $a0 str_to_print
    syscall

    print_new_line
    pop_a0_v0                          # pop $a0 and $v0 off stack

.end_macro

#------------------------------------------------------------------------
# print in line string - without new line

.macro print_in_line_str(%str)

    .data
    in_line_str_to_print: .asciiz %str

    .text
    push_a0_v0                         # push $a0 and $v0 to stack so
                                       # values are not overwritten

    addiu $v0 $zero   4
    la    $a0 in_line_str_to_print
    syscall

    pop_a0_v0                          # pop $a0 and $v0 off stack

.end_macro

#------------------------------------------------------------------------
# print horizontal line

.macro print_horiz_line

    print_str("==================================================")

.end_macro

#------------------------------------------------------------------------
# print thin horizontal line

.macro print_thin_horiz_line

    print_str("--------------------------------------------------")

.end_macro

#------------------------------------------------------------------------
# print value as hex

.macro print_hex_val(%reg_to_print)

push_a0_v0                             # push $a0 and $v0 to stack so
                                       # values are not overwritten
add   $a0 $zero   %reg_to_print
addiu $v0 $zero   34                   # print value as hex

syscall

print_new_line                         # add new line so next string
                                       # starts at beginning on line
                                       
pop_a0_v0                              # pop $a0 and $v0 off stack

.end_macro

#------------------------------------------------------------------------
# print value as decimal int

.macro print_decimal_val(%reg_to_print)

    push_a0_v0                         # push $a0 and $v0 to stack so
                                       # values are not overwritten
    add   $a0 $zero   %reg_to_print
    addiu $v0 $zero   1                # print decimal value
    syscall

    print_new_line                     # add new line so next string
                                       # starts at beginning on line
                                       
pop_a0_v0                              # pop $a0 and $v0 off stack

.end_macro

#------------------------------------------------------------------------
# print_s_regs
# used to print values of registers before and after function
#
# arguments: %func         - name of subroutine being executed
#            %before_after - has value of "before" or "after"
#------------------------------------------------------------------------

.macro print_s_regs(%func, %before_after)

    print_new_line
    print_thin_horiz_line
    print_s_val($s0, "$s0", %func, %before_after)
    print_s_val($s1, "$s1", %func, %before_after)
    print_s_val($s2, "$s2", %func, %before_after)
    print_s_val($s3, "$s3", %func, %before_after)
    print_s_val($s4, "$s4", %func, %before_after)
    print_s_val($s5, "$s5", %func, %before_after)
    print_s_val($s6, "$s6", %func, %before_after)
    print_s_val($s7, "$s7", %func, %before_after)
    print_thin_horiz_line
    print_new_line

.end_macro

.macro print_s_val(%s_reg, %s_reg_str, %func, %before_after)

    print_in_line_str(%s_reg_str)
    print_in_line_str(" ")
    print_in_line_str(%before_after)
    print_in_line_str(" ")
    print_in_line_str(%func)
    print_in_line_str(": ")
    print_hex_val(%s_reg)

.end_macro



#------------------------------------------------------------------------
# set random values for registers

.macro randomize_regs

    li      $v0 41
    li      $a0 0x1234
    syscall
    move    $t0 $a0
    syscall
    move    $t1 $a0
    syscall
    move    $t2 $a0
    syscall
    move    $t3 $a0
    syscall
    move    $t4 $a0
    syscall
    move    $t5 $a0
    syscall
    move    $t6 $a0
    syscall
    move    $t7 $a0
    syscall
    move    $t8 $a0
    syscall
    move    $t9 $a0
    syscall
    move    $a1 $a0
    syscall
    move    $a2 $a0
    syscall
    move    $a3 $a0
    syscall
    move    $v1 $a0
    syscall
    move    $v0 $a0

.end_macro

#------------------------------------------------------------------------
# print header and s reg values before calling subroutine

.macro print_testing_header(%str_func_name)

    print_horiz_line                                # print "testing" header
    print_in_line_str("testing ")
    print_str(%str_func_name)
    print_s_regs(%str_func_name, "before")

.end_macro

#------------------------------------------------------------------------
# print input value header

.macro input_val_header(%str_func_name)

    print_str("---")
    print_in_line_str(%str_func_name)
    print_str(" input value")
    print_new_line

.end_macro

#------------------------------------------------------------------------
# print return value header

.macro return_val_header(%str_func_name)

    print_new_line
    print_str("---")
    print_in_line_str(%str_func_name)
    print_str(" return values")
    print_new_line

.end_macro

#------------------------------------------------------------------------
# call subroutine that requires printing

.macro call_printing_subroutine(%subroutine)

    .text
    print_thin_horiz_line
    print_str("Printed output from subroutine will appear between")
    print_str("the following horizontal lines.")
    print_thin_horiz_line
    jal   %subroutine
    print_new_line
    print_thin_horiz_line

.end_macro

#------------------------------------------------------------------------
# call  subroutine

.macro call_subroutine(%subroutine)

    .text
    print_thin_horiz_line
    print_str("entering subroutine...")
    print_thin_horiz_line
    jal   %subroutine

.end_macro

#------------------------------------------------------------------------
# print integer array

.macro print_int_array (%ptr, %length)

    move $t0 %length
    move $t1 %ptr
    move $t2 $zero       # counter
    
    print_int_array_loop: nop
    
    lw   $t3 ($t1)
    
    print_hex_val($t3)
    
    addi $t2  $t2  1
    addi $t1  $t1  4
    
    blt  $t2  $t0  print_int_array_loop
    
.end_macro

#------------------------------------------------------------------------
# print integer array with header

.macro print_int_array_w_header(%ptr, %length, %before_after, %subroutine)
    
    print_str("---")
    print_in_line_str("int array contents ")
    print_in_line_str(%before_after)
    print_in_line_str(" ")
    print_in_line_str(%subroutine)
    print_new_line
    print_new_line
    print_int_array(%ptr, %length)
    
.end_macro

#------------------------------------------------------------------------
# initialize array

.macro initialize_array(%ptr, %length)

    move $t0 $zero        # initialize counter
    move $t1 %length
    
    initialize_array_loop: nop
    
    sw   $zero (%ptr)
    addi %ptr   %ptr    4
    addi $t0    $t0     1
    blt  $t0    $t1     initialize_array_loop
    
.end_macro


#------------------------------------------------------------------------
# REGISTER USAGE
# $s4 - double pointer to string array for test condition
#



#-----------------------------------------------------------------------
#-----------------------------------------------------------------------
#-----------------------------------------------------------------------
#-----------------------------------------------------------------------
# START OF TEST CODE                                            

.data                                         # modify these parameters
                                              # to correspond with
                                              # program arguments

num_elements:   .word 3                       # change this to match
                                              # number of program args

test_int_array: .space 16                     # placeholder for int array
                                              # change to correspond to
                                              # num_elements i.e.
                                              # 4 x (# program args + 1)
                                              # e.g. size 24 for 5 program arguments
                                         
.text
set_s_vals

move  $s4    $a1                               # saves double pointer to string array
                                               # from program argument

#-----------------------------------------------------------------------
# test get_array_length

.text
randomize_regs

move $a0 $s4                                   # dbl ptr to str array

print_testing_header("get_array_length")
call_subroutine(get_array_length)

return_val_header("get_array_length")          # display return values
print_in_line_str("array length, $v0: ")
print_decimal_val($v0)

print_s_regs("get_array_length", "after")      # display s regs


#-----------------------------------------------------------------------
# test print_str_array

randomize_regs

lw    $a0   num_elements                      # size of array
move  $a1   $s4                               # dbl ptr to string array

print_testing_header("print_str_array")
call_printing_subroutine(print_str_array)     # enter subroutine
print_s_regs("print_str_array", "after")      # display s regs after func


#-----------------------------------------------------------------------
# test str_to_int

.data
str_to_int_test: .asciiz "0xABCD1234"         # modify with test case

.text
randomize_regs

la    $a0 str_to_int_test                     # load argument

print_testing_header("str_to_int")
input_val_header("str_to_int")                # display input values
print_in_line_str("($a0): ")

li    $v0  4
syscall

print_new_line
print_new_line

call_subroutine(str_to_int)                   # enter subroutine

return_val_header("str_to_int")               # display return values
print_in_line_str("integer output, $v0: ")
print_hex_val($v0)

print_s_regs("str_to_int", "after")           # display s regs


#-----------------------------------------------------------------------
# test str_to_int_array

.text
randomize_regs

lw    $a0   num_elements                      # size of array
move  $a1   $s4                               # dbl ptr to string array
la    $a2   test_int_array                    # int array ptr

move  $s0  $a0                                # save for printing after
move  $s2  $a2                                # subroutine call

print_testing_header("str_to_int_array")

                                              # display int array
                                              # before function call
                                              
print_int_array_w_header($a2, $a0, "before", "str_to_int_array")    
                                              
print_new_line
call_subroutine(str_to_int_array)
print_new_line
                                              # display int array
                                              # after function call
                                              
print_int_array_w_header($s2, $s0, "after", "str_to_int_array")

print_s_regs("str_to_int_array", "after")     # display s regs

#-----------------------------------------------------------------------
# test sort_array

.data
sort_array_test:   .word 0x0FFFFFFF           # modify with test case
                   .word 0x0BCD0022
                   .word 0x00000001
                   
sort_array_length: .word 3                    # modify to correspond
                                              # with test case above
                                              # should match number of
                                              # elements in
                                              # sort_array_test

.text
randomize_regs

la   $a1 sort_array_test                      # load arguments
lw   $a0 sort_array_length

move $s0  $a0                                 # save for printing after
move $s1  $a1                                 # subroutine call

print_testing_header("sort_array")
print_int_array_w_header($s1, $s0, "before", "sort_array")    

print_new_line
call_subroutine(sort_array)

return_val_header("sort_array")               # display return values
print_in_line_str("min element, $v0: ")
print_hex_val($v0)
print_in_line_str("max element, $v1: ")
print_hex_val($v1)

print_new_line
print_int_array_w_header($s1, $s0, "after", "sort_array")

print_s_regs("sort_array", "after")     # display s regs after func

#-----------------------------------------------------------------------
# test print_decimal

.data
print_decimal_test: .word 0x80000000          # modify with sepcific
                                              # test case

.text

lw   $a0   print_decimal_test                 # load test argument

print_testing_header("print_decimal")
input_val_header("print_decimal")             # display input values
print_in_line_str("$a0: ")
li    $v0  34
syscall

print_new_line
print_new_line
call_printing_subroutine(print_decimal)

print_s_regs("print_decimal", "after")        # display s regs

#-----------------------------------------------------------------------
# test print_decimal_array

.data
print_decimal_arr_test: .word 0xFFFFFFFC         # modify with specific
                        .word 0xABCD1234         # test case
                        .word 0x000EE002
                        
print_decimal_arr_len:  .word 3                  # modify to correspond
                                                 # with test case above
                                                 # should match number of
                                                 # elements in
                                                 # print_decimal_arr_test

.text
la   $s1 print_decimal_arr_test                  # save arguments
lw   $s0 print_decimal_arr_len

print_testing_header("print_decimal_array")
print_int_array_w_header($s1, $s0, "before", "print_decimal_array")    
print_new_line

move $a1 $s1                                     # load arguments
move $a0 $s0

call_printing_subroutine(print_decimal_array)
print_new_line

print_int_array_w_header($s1, $s0, "after", "print_decimal_array")

print_s_regs("print_decimal_array", "after")     # display s regs

#-----------------------------------------------------------------------
# test main_function_lab5_19q4_fa_ce12

randomize_regs

la    $t3   test_int_array                    # int array ptr
lw    $t2   num_elements

initialize_array($t3, $t2)                    # clear int array

move  $a1   $s4                               # dbl ptr to string array
la    $a0   test_int_array                    # int array ptr
lw    $t0   num_elements

print_testing_header("main_function_lab5_19q4_fa_ce12")
print_int_array_w_header($a0, $t2, "before", "main_function_lab5_19q4_fa_ce12")    
print_new_line

call_printing_subroutine(main_function_lab5_19q4_fa_ce12)

return_val_header("main_function_lab5_19q4_fa_ce12")     # display return values
print_in_line_str("min element, $v0: ")
print_hex_val($v0)
print_in_line_str("max element, $v1: ")
print_hex_val($v1)

lw $t0 num_elements
la $t1 test_int_array
print_new_line
print_int_array_w_header($t1, $t0, "after", "main_function_lab5_19q4_fa_ce12")

print_s_regs("main_function_lab5_19q4_fa_ce12", "after") # display s regs

#------------------------------------------------------------------------
# exit program

jal exit_program


#------------------------------------------------------------------------
# include statement

.include  "Lab5.asm"  #replace this with Lab5.asm


#          ()()
#         (**)
# � 2019  (______)*
