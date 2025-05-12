<div>
	<h1 class="text-xl m-4"><i class="fa-solid fa-user-group"></i> Create Group</h1>
	<form method="POST">
		<div class="main-settings space-y-2 mx-4">
			<div>
				<span class="ml-2">Name</span>
				<input class="input" title="Name" name="name" type="text" required minlength="1" />
			</div>
			<div>
				<span class="ml-2">Description</span>
				<input class="input" title="Description" name="description" type="text" />
			</div>
		</div>
		<hr class="!border-t-2 mt-2" />
		<div class="flex justify-center py-2">
			<label class="">
				<input name="public" class="checkbox" type="checkbox" />
				Public
			</label>
		</div>
		<hr class="!border-t-2" />
		<div class="default-categories my-4 flex justify-center">
			<div class="grid grid-cols-2 space-y-2">
				<label class="flex items-center space-x-2">
					<input name="song" class="checkbox" type="checkbox" checked />
					<p>Song</p>
				</label>
				<label class="flex items-center space-x-2">
					<input name="vocals" class="checkbox" type="checkbox" />
					<p>Vocals</p>
				</label>
				<label class="flex items-center space-x-2">
					<input name="choreography" class="checkbox" type="checkbox" />
					<p>Choreography</p>
				</label>
				<label class="flex items-center space-x-2">
					<input name="stage_design" class="checkbox" type="checkbox" />
					<p>Stage Design</p>
				</label>
				<label class="flex items-center space-x-2">
					<input name="outfit" class="checkbox" type="checkbox" />
					<p>Outfit</p>
				</label>
				<label class="flex items-center space-x-2">
					<input name="drink" class="checkbox" type="checkbox" />
					<p>Drink</p>
				</label>
				<label class="flex items-center space-x-2">
					<input name="snack" class="checkbox" type="checkbox" />
					<p>Snack</p>
				</label>
				<label class="flex items-center space-x-2">
					<input name="meme_potential" class="checkbox" type="checkbox" />
					<p>Meme Potential</p>
				</label>
			</div>
		</div>
		<div class="custom-categories"></div>
		<div class="flex justify-center">
			<button type="submit" class="btn variant-filled-primary">Create Group</button>
		</div>
	</form>
</div>
