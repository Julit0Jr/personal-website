$(document).ready(function(){
	$('.delete-item').on('click', function(){ //if delete button is clicked
		var id = $(this).data('id');
		var url = '/delete/ ' +id;
		if(confirm('Delete this To-do item?')){
			$.ajax({
				url: url,
				type: 'DELETE',
				success: function(result){
					console.log('To-do item deleted');
					window.location.href = '/';
				},
				error: function(err){
					console.log(err);
				}
			});
		}
	});

	$('.edit-item').on('click', function(){ //if edit button is clicked
		$('#edit-form-subject_name').val($(this).data('name'));
		$('#edit-form-definition').val($(this).data('definition'));
		$('#edit-form-due_date').val($(this).data('due'));
		$('#edit-form-id').val($(this).data('id'));
	});
}); 