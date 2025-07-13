<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Screen extends Model
{
    //

    protected $casts = [
        'actions' => 'array',
        'inputs' => 'array',
        'static_content' => 'array',
        'navigations' => 'array',
        'states' => 'array',
        'data' => 'array',
    ];
    
    protected $fillable = [
        'project_id',
        'category_id',
        'title',
        'type',
        'image_url',
        'purpose',
        'actions',
        'inputs',
        'static_content',
        'navigations',
        'states',
        'data',
    ];
    
    public function project()
    {
        return $this->belongsTo(Project::class);
    }
    
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
    
}
