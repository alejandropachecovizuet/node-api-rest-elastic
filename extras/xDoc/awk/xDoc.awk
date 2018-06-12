
BEGIN{
       print "\<ul class=\"list-group\">"
     }
     {
       split($1,a,"(")
       print "\<li  class=\"list-group-item\">\<div class=\"bg-success\" role=\"alert\">\<b>"; 
       print toupper(substr(a[2],index(a[2], "').")+3,length(a[2])))
       print substr(a[2],2,index(a[2], "')")-2)"\</b>"
       print "\</div>\<ul>"
	   if ($2!=""){
		   print "\<li class=\"list-group-item\" style=\"padding:0px 0px !important\" >"$2"\</li>" 
	   }       
	   if ($3 !=""){
		   print "\<li class=\"list-group-item\" style=\"padding:0px 0px !important\">"$3"\</li>" 
	   }       
	   if ($4 !=""){
		   print "\<li class=\"list-group-item\" style=\"padding:0px 0px !important\">"$4"\</li>" 
	   }       
	   if ($5 !=""){
		   print "\<li class=\"list-group-item\" style=\"padding:0px 0px !important\">"$5"\</li>" 
	   }       
	   if ($6 !=""){
		   print "\<li class=\"list-group-item\" style=\"padding:0px 0px !important\">"$6"\</li>" 
	   }       
	   if ($7 !=""){
		   print "\<li class=\"list-group-item\" style=\"padding:0px 0px !important\">"$7"\</li>" 
	   }       
	   if ($8 !=""){
		   print "\<li class=\"list-group-item\" style=\"padding:0px 0px !important\">"$8"\</li>" 
	   }       
       print "\</ul>"
       print "\</li>"; 
     }
  END{
       print "\</ul>"
     }
