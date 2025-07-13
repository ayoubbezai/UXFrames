<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $projects = Project::all();

            return response()->json([
                'success' => true,
                'message' => 'Projects retrieved successfully',
                'data' => $projects
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve projects',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'name'        => 'required|string',
                'description' => 'nullable|string',
                'start_time'  => 'nullable|date',
                'end_time'    => 'nullable|date',
                'price'       => 'nullable|numeric',
                'status'      => 'nullable|string',
                'figma_url'   => 'nullable|string',
                'docs_url'    => 'nullable|string',
                'live_url'    => 'nullable|string',
                'other_url'    => 'nullable|string',
                'logo'        => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
            ]);

            // Handle logo upload
            if ($request->hasFile('logo')) {
                $path = $request->file('logo')->store('logos', 'public');
                $data['logo_url'] = asset('storage/' . $path);
            }

            $project = Project::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Project created successfully',
                'data' => $project
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create project',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        return response()->json([
            'success' => true,
            'message' => 'Project retrieved successfully',
            'data' => $project
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project)
    {
        try {
            $data = $request->validate([
                'name'        => 'sometimes|required|string',
                'description' => 'nullable|string',
                'start_time'  => 'nullable|date',
                'end_time'    => 'nullable|date',
                'price'       => 'nullable|numeric',
                'status'      => 'nullable|string',
                'figma_url'   => 'nullable|string',
                'docs_url'    => 'nullable|string',
                'live_url'    => 'nullable|string',
                'other_url'    => 'nullable|string',
                'logo'        => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
            ]);

            if ($request->hasFile('logo')) {
                $path = $request->file('logo')->store('logos', 'public');
                $data['logo_url'] = asset('storage/' . $path);
            }

            $project->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Project updated successfully',
                'data' => $project
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update project',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        try {
            $project->delete();

            return response()->json([
                'success' => true,
                'message' => 'Project deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete project',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
