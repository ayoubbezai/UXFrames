<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    //
    public function project()
{
    return $this->belongsTo(Project::class);
}

public function screens(){
    return $this->hasMany(Screen::class);
}

    protected $fillable = ['name', 'description', 'project_id'];
}
